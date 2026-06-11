const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const defaultValues = Array.from({ length: 12 }, () => ({ income: 0, expense: 0 }));
let bucksChart;
let currentChartType = 'bar';

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    }).format(value);
}

function createInputCell(id, value) {
    const td = document.createElement('td');
    td.innerHTML = `
        <div class="input-group input-group-lg">
            <span class="input-group-text currency-prefix">$</span>
            <input
                id="${id}"
                type="number"
                min="0"
                step="0.01"
                value="${value.toFixed(2)}"
                class="form-control form-control-lg"
                aria-label="${id}"
            />
        </div>
    `;
    return td;
}

function buildMonthRows() {
    const tbody = document.getElementById('month-table-body');
    tbody.innerHTML = '';

    monthLabels.forEach((month, index) => {
        const row = document.createElement('tr');
        const monthCell = document.createElement('th');
        monthCell.scope = 'row';
        monthCell.textContent = month;

        row.appendChild(monthCell);
        row.appendChild(createInputCell(`income-${index}`, 0));
        row.appendChild(createInputCell(`expense-${index}`, 0));

        tbody.appendChild(row);
    });
}

function getNumericValue(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return 0;
    const value = parseFloat(input.value);
    return Number.isFinite(value) && value >= 0 ? value : 0;
}

function collectValues() {
    return monthLabels.map((_, index) => ({
        income: getNumericValue(`income-${index}`),
        expense: getNumericValue(`expense-${index}`)
    }));
}

function updateTotals(values) {
    const totalIncome = values.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = values.reduce((sum, item) => sum + item.expense, 0);
    const netValue = totalIncome - totalExpense;

    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expense').textContent = formatCurrency(totalExpense);

    const chartTotalIncome = document.getElementById('chart-total-income');
    const chartTotalExpense = document.getElementById('chart-total-expense');
    const chartNet = document.getElementById('chart-net');

    if (chartTotalIncome) chartTotalIncome.textContent = formatCurrency(totalIncome);
    if (chartTotalExpense) chartTotalExpense.textContent = formatCurrency(totalExpense);
    if (chartNet) {
        chartNet.textContent = formatCurrency(netValue);
        chartNet.classList.toggle('text-success', netValue >= 0);
        chartNet.classList.toggle('text-danger', netValue < 0);
    }
}

function getUsernameValidationState(username) {
    return {
        length: username.length >= 5,
        uppercase: /[A-Z]/.test(username),
        number: /\d/.test(username),
        special: /[^A-Za-z0-9]/.test(username)
    };
}

function validateUsername(username) {
    return Object.values(getUsernameValidationState(username)).every(Boolean);
}

function bindUsernameValidation() {
    const usernameForm = document.getElementById('usernameForm');
    const usernameInput = document.getElementById('usernameInput');
    const usernameSubmitBtn = document.getElementById('usernameSubmitBtn');
    const usernameFeedback = document.getElementById('usernameFeedback');
    const usernameHero = document.getElementById('usernameHero');
    const usernameDisplay = document.getElementById('usernameDisplay');

    const showFeedback = (message, isValid) => {
        if (!usernameFeedback || !usernameInput) return;
        usernameFeedback.textContent = message;
        usernameFeedback.classList.toggle('text-success', isValid);
        usernameFeedback.classList.toggle('text-danger', !isValid);
        usernameInput.classList.toggle('is-valid', isValid);
        usernameInput.classList.toggle('is-invalid', !isValid && usernameInput.value.length > 0);
        usernameInput.setAttribute('aria-invalid', String(!isValid));
    };

    const updateRequirementList = username => {
        const state = getUsernameValidationState(username);
        const requirements = document.querySelectorAll('#usernameRequirements [data-validation]');

        requirements.forEach(requirement => {
            const key = requirement.dataset.validation;
            const valid = Boolean(state[key]);
            requirement.classList.toggle('valid', valid);
            requirement.classList.toggle('invalid', !valid);
            requirement.textContent = `${valid ? '✓' : '✗'} ${requirement.dataset.label}`;
        });

        return Object.values(state).every(Boolean);
    };

    if (!usernameForm || !usernameInput || !usernameSubmitBtn) return;

    const updateState = () => {
        const username = usernameInput.value.trim();
        const isValid = updateRequirementList(username);

        usernameSubmitBtn.disabled = !isValid;
        if (usernameHero && usernameDisplay && !isValid) {
            usernameHero.classList.add('d-none');
            usernameDisplay.textContent = '';
        }

        if (!username) {
            showFeedback('', true);
            usernameInput.classList.remove('is-valid', 'is-invalid');
        }

        return isValid;
    };

    usernameInput.addEventListener('input', updateState);

    usernameForm.addEventListener('submit', event => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const isValid = updateState();

        if (isValid) {
            if (usernameHero && usernameDisplay) {
                usernameDisplay.textContent = username;
                usernameHero.classList.remove('d-none');
            }
            showFeedback('Username is valid. Your dashboard is ready!', true);
        } else {
            showFeedback('Invalid username. It must be 5+ chars and include uppercase, number, and special character.', false);
        }
    });

    updateState();
}

function updateChart(values) {
    const incomeData = values.map(item => item.income);
    const expenseData = values.map(item => item.expense);

    const chartCanvas = document.getElementById('bucks2barChart');
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');
    const shouldRecreate = !bucksChart || bucksChart.config.type !== currentChartType;
    if (shouldRecreate && bucksChart) {
        bucksChart.destroy();
        bucksChart = null;
    }

    if (!bucksChart) {
        // create glossy gradients for a subtle 3D effect
        const gradientIncome = ctx.createLinearGradient(0, 0, 0, 400);
        gradientIncome.addColorStop(0, 'rgba(72, 197, 156, 0.95)');
        gradientIncome.addColorStop(0.5, 'rgba(25, 135, 84, 0.85)');
        gradientIncome.addColorStop(1, 'rgba(17, 92, 56, 0.9)');

        const gradientExpense = ctx.createLinearGradient(0, 0, 0, 400);
        gradientExpense.addColorStop(0, 'rgba(255,140,145,0.95)');
        gradientExpense.addColorStop(0.5, 'rgba(220, 53, 69, 0.86)');
        gradientExpense.addColorStop(1, 'rgba(165, 34, 38, 0.9)');

        bucksChart = new Chart(ctx, {
            type: currentChartType,
            data: {
                labels: monthLabels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: gradientIncome,
                        borderColor: 'rgba(18, 120, 75, 0.95)',
                        borderWidth: 1,
                        borderRadius: 6,
                        barThickness: 'flex',
                        fill: false,
                        tension: 0.4,
                        pointRadius: currentChartType === 'line' ? 4 : 0,
                        pointHoverRadius: currentChartType === 'line' ? 6 : 0,
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        backgroundColor: gradientExpense,
                        borderColor: 'rgba(165, 34, 38, 0.95)',
                        borderWidth: 1,
                        borderRadius: 6,
                        barThickness: 'flex',
                        fill: false,
                        tension: 0.4,
                        pointRadius: currentChartType === 'line' ? 4 : 0,
                        pointHoverRadius: currentChartType === 'line' ? 6 : 0,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 300,
                },
                scales: {
                    x: {
                        stacked: false,
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => formatCurrency(value)
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: context => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                        }
                    }
                }
            }
        });
    } else {
        bucksChart.data.datasets[0].data = incomeData;
        bucksChart.data.datasets[1].data = expenseData;
        bucksChart.update();
    }
}

function updateData() {
    const values = collectValues();
    updateTotals(values);
    updateChart(values);
}

function bindInputEvents() {
    monthLabels.forEach((_, index) => {
        const incomeInput = document.getElementById(`income-${index}`);
        const expenseInput = document.getElementById(`expense-${index}`);

        [incomeInput, expenseInput].forEach(input => {
            if (!input) return;
            input.addEventListener('input', () => {
                if (input.value === '' || parseFloat(input.value) < 0) {
                    input.value = '0.00';
                }
                updateData();
            });
        });
    });
}

function bindChartTypeEvents() {
    const barBtn = document.getElementById('chartTypeBarBtn');
    const lineBtn = document.getElementById('chartTypeLineBtn');

    const setChartType = type => {
        if (currentChartType === type) return;
        currentChartType = type;

        if (barBtn) barBtn.classList.toggle('active', type === 'bar');
        if (lineBtn) lineBtn.classList.toggle('active', type === 'line');

        updateData();
    };

    if (barBtn) {
        barBtn.addEventListener('click', () => setChartType('bar'));
    }
    if (lineBtn) {
        lineBtn.addEventListener('click', () => setChartType('line'));
    }
}

function downloadChart() {
    if (!bucksChart) {
        alert('Chart is not ready yet. Please wait a moment.');
        return;
    }
    
    const image = bucksChart.toBase64Image();
    const link = document.createElement('a');
    link.href = image;
    link.download = `bucks2bar-chart-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function initializeBucks2Bar() {
    buildMonthRows();
    bindInputEvents();
    bindChartTypeEvents();
    bindUsernameValidation();
    updateData();
    
    const downloadBtn = document.getElementById('downloadChartBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadChart);
    }
}

window.addEventListener('DOMContentLoaded', initializeBucks2Bar);

export {
    formatCurrency,
    getNumericValue,
    collectValues,
    getUsernameValidationState,
    validateUsername,
    updateTotals,
    updateData,
};

