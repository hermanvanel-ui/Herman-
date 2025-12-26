// WebSocket connection
let ws = null;
let reconnectInterval = null;

// Connect to WebSocket
function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('WebSocket connected');
        document.getElementById('connection-status').textContent = 'Connected';
        document.getElementById('connection-status').className = 'badge badge-success';

        // Clear reconnect interval
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }
    };

    ws.onmessage = (event) => {
        try {
            const status = JSON.parse(event.data);
            updateStatus(status);
        } catch (e) {
            console.error('Error parsing WebSocket message:', e);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected');
        document.getElementById('connection-status').textContent = 'Disconnected';
        document.getElementById('connection-status').className = 'badge badge-danger';

        // Attempt to reconnect
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                console.log('Attempting to reconnect...');
                connectWebSocket();
            }, 5000);
        }
    };
}

// Update status display
function updateStatus(status) {
    // App mode
    const modeEl = document.getElementById('app-mode');
    modeEl.textContent = status.app_mode || 'LIVE';
    modeEl.className = status.app_mode === 'DRY_RUN' ? 'badge badge-warning' : 'badge badge-success';

    // Telegram status
    const telegramConnected = status.telegram_connected;
    document.getElementById('telegram-status').className =
        `status-indicator ${telegramConnected ? 'status-connected' : 'status-disconnected'}`;
    document.getElementById('telegram-connected').textContent = telegramConnected ? 'Connected' : 'Disconnected';
    document.getElementById('telegram-channel').textContent = status.telegram_channel || '-';
    document.getElementById('telegram-last-msg').textContent = status.telegram_last_message_id || '-';
    document.getElementById('telegram-last-check').textContent =
        status.telegram_last_check ? formatDateTime(status.telegram_last_check) : '-';

    // Telegram error
    const telegramError = document.getElementById('telegram-error');
    if (status.telegram_error) {
        telegramError.textContent = status.telegram_error;
        telegramError.style.display = 'block';
    } else {
        telegramError.style.display = 'none';
    }

    // MT5 status
    const mt5Connected = status.mt5_connected;
    document.getElementById('mt5-status').className =
        `status-indicator ${mt5Connected ? 'status-connected' : 'status-disconnected'}`;
    document.getElementById('mt5-connected').textContent = mt5Connected ? 'Connected' : 'Disconnected';
    document.getElementById('mt5-account').textContent = status.mt5_account || '-';
    document.getElementById('mt5-server').textContent = status.mt5_server || '-';
    document.getElementById('mt5-balance').textContent =
        status.mt5_balance ? `$${status.mt5_balance.toFixed(2)}` : '-';
    document.getElementById('mt5-equity').textContent =
        status.mt5_equity ? `$${status.mt5_equity.toFixed(2)}` : '-';

    // MT5 error
    const mt5Error = document.getElementById('mt5-error');
    if (status.mt5_error) {
        mt5Error.textContent = status.mt5_error;
        mt5Error.style.display = 'block';
    } else {
        mt5Error.style.display = 'none';
    }

    // Statistics
    document.getElementById('app-uptime').textContent = formatUptime(status.app_uptime);
    document.getElementById('total-signals').textContent = status.total_signals || 0;
    document.getElementById('total-executed').textContent = status.total_executed || 0;
    document.getElementById('total-failed').textContent = status.total_failed || 0;

    const successRate = status.total_signals > 0
        ? ((status.total_executed / status.total_signals) * 100).toFixed(1)
        : 0;
    document.getElementById('success-rate').textContent = `${successRate}%`;

    // Recent errors
    updateErrors(status.recent_errors || []);

    // Update last update time
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
}

// Update errors list
function updateErrors(errors) {
    const errorsList = document.getElementById('errors-list');

    if (!errors || errors.length === 0) {
        errorsList.innerHTML = '<p class="text-muted">No errors</p>';
        return;
    }

    errorsList.innerHTML = errors.map(error => `
        <div class="error-item">
            <div class="error-time">${formatDateTime(error.timestamp)}</div>
            <div class="error-text">${escapeHtml(error.error)}</div>
        </div>
    `).join('');
}

// Load trades
async function loadTrades() {
    try {
        const response = await fetch('/api/trades?limit=50');
        const trades = await response.json();

        const tbody = document.getElementById('trades-body');

        if (!trades || trades.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No trades yet</td></tr>';
            return;
        }

        tbody.innerHTML = trades.map(trade => `
            <tr>
                <td>${formatDateTime(trade.timestamp)}</td>
                <td>${trade.action}</td>
                <td>${trade.symbol || '-'}</td>
                <td>${trade.direction || '-'}</td>
                <td>${trade.entry_price ? trade.entry_price.toFixed(5) : '-'}</td>
                <td>${trade.stop_loss ? trade.stop_loss.toFixed(5) : '-'}</td>
                <td>${trade.take_profit ? trade.take_profit.toFixed(5) : '-'}</td>
                <td><span class="status-badge status-${trade.status.toLowerCase()}">${trade.status}</span></td>
                <td>${trade.mt5_ticket || '-'}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error loading trades:', error);
        document.getElementById('trades-body').innerHTML =
            '<tr><td colspan="9" class="text-center error">Error loading trades</td></tr>';
    }
}

// Load positions
async function loadPositions() {
    try {
        const response = await fetch('/api/positions');
        const positions = await response.json();

        const tbody = document.getElementById('positions-body');

        if (!positions || positions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No open positions</td></tr>';
            return;
        }

        tbody.innerHTML = positions.map(pos => `
            <tr>
                <td>${pos.ticket}</td>
                <td>${pos.symbol}</td>
                <td>${pos.type}</td>
                <td>${pos.volume.toFixed(2)}</td>
                <td>${pos.price_open.toFixed(5)}</td>
                <td>${pos.sl ? pos.sl.toFixed(5) : '-'}</td>
                <td>${pos.tp ? pos.tp.toFixed(5) : '-'}</td>
                <td class="${pos.profit >= 0 ? 'success' : 'error'}">
                    ${pos.profit >= 0 ? '+' : ''}${pos.profit.toFixed(2)}
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error loading positions:', error);
        document.getElementById('positions-body').innerHTML =
            '<tr><td colspan="8" class="text-center error">Error loading positions</td></tr>';
    }
}

// Utility functions
function formatDateTime(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString();
}

function formatUptime(seconds) {
    if (!seconds) return '-';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
document.getElementById('refresh-trades').addEventListener('click', loadTrades);
document.getElementById('refresh-positions').addEventListener('click', loadPositions);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Trade Copier Dashboard...');

    // Connect WebSocket
    connectWebSocket();

    // Load initial data
    loadTrades();
    loadPositions();

    // Refresh trades and positions every 10 seconds
    setInterval(() => {
        loadTrades();
        loadPositions();
    }, 10000);
});
