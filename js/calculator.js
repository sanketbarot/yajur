/* ============================================
   NANDIINDIA - CALCULATOR JS
   Version 2.0 - All Calculators Fixed
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ===== SHARED UTILITIES =====

    // FIX: Use CSS variable for slider track
    function updateSliderTrack(slider) {
        if (!slider) return;
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        const pct = ((val - min) / (max - min)) * 100;
        slider.style.background = `
            linear-gradient(
                to right,
                var(--primary) ${pct}%,
                var(--border) ${pct}%
            )
        `;
    }

    // FIX: Reusable sync helper
    function syncSlider(inputEl, rangeEl, callback) {
        if (!inputEl || !rangeEl) return;

        inputEl.addEventListener('input', () => {
            // Clamp value
            let val = parseFloat(inputEl.value);
            const min = parseFloat(rangeEl.min);
            const max = parseFloat(rangeEl.max);
            if (!isNaN(val)) {
                val = Math.min(Math.max(val, min), max);
                rangeEl.value = val;
            }
            updateSliderTrack(rangeEl);
            callback();
        });

        rangeEl.addEventListener('input', () => {
            inputEl.value = rangeEl.value;
            updateSliderTrack(rangeEl);
            callback();
        });
    }

    // Currency formatter
    function formatCurrency(amount) {
        if (isNaN(amount) || amount < 0) return '₹0';
        if (amount >= 10000000) {
            return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
        } else if (amount >= 100000) {
            return '₹' + (amount / 100000).toFixed(2) + ' L';
        } else {
            return '₹' + Math.round(amount).toLocaleString('en-IN');
        }
    }

    // Create doughnut chart
    function createDoughnutChart(canvasId, labels, data, colors) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 16,
                            usePointStyle: true,
                            pointStyleWidth: 10,
                            font: {
                                family: "'Plus Jakarta Sans', sans-serif",
                                size: 11,
                                weight: '500'
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleFont: {
                            family: "'Plus Jakarta Sans', sans-serif",
                            size: 12,
                            weight: '600'
                        },
                        bodyFont: {
                            family: "'Plus Jakarta Sans', sans-serif",
                            size: 11
                        },
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function(context) {
                                return ' ' + formatCurrency(
                                    Math.round(context.parsed)
                                );
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 600
                }
            }
        });
    }

    // ===== SIP CALCULATOR =====
    const sipAmount = document.getElementById('sipAmount');
    const sipAmountRange = document.getElementById('sipAmountRange');
    const sipReturn = document.getElementById('sipReturn');
    const sipReturnRange = document.getElementById('sipReturnRange');
    const sipYears = document.getElementById('sipYears');
    const sipYearsRange = document.getElementById('sipYearsRange');

    const investedDisplay = document.getElementById('investedAmount');
    const returnsDisplay = document.getElementById('estimatedReturns');
    const totalDisplay = document.getElementById('totalWealth');

    let sipChart = null;

    function calculateSIP() {
        const P = parseFloat(sipAmount?.value) || 0;
        const r = (parseFloat(sipReturn?.value) || 0) / 100 / 12;
        const n = (parseInt(sipYears?.value) || 0) * 12;

        if (P <= 0 || r <= 0 || n <= 0) {
            if (investedDisplay) investedDisplay.textContent = '₹0';
            if (returnsDisplay) returnsDisplay.textContent = '₹0';
            if (totalDisplay) totalDisplay.textContent = '₹0';
            return;
        }

        const invested = P * n;
        const totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const returns = totalValue - invested;

        if (investedDisplay) investedDisplay.textContent = formatCurrency(invested);
        if (returnsDisplay) returnsDisplay.textContent = formatCurrency(returns);
        if (totalDisplay) totalDisplay.textContent = formatCurrency(totalValue);

        // Update chart
        if (sipChart) {
            sipChart.data.datasets[0].data = [invested, returns];
            sipChart.update('none');
        } else {
            sipChart = createDoughnutChart(
                'sipChart',
                ['Invested Amount', 'Estimated Returns'],
                [invested, returns],
                {
                    bg: ['#7c3aed', '#f97316'],
                    border: ['#6d28d9', '#ea6500']
                }
            );
        }

        // Update breakdown table
        updateBreakdownTable(P, parseFloat(sipReturn?.value) || 12, parseInt(sipYears?.value) || 10);
    }

    if (sipAmount) {
        syncSlider(sipAmount, sipAmountRange, calculateSIP);
        syncSlider(sipReturn, sipReturnRange, calculateSIP);
        syncSlider(sipYears, sipYearsRange, calculateSIP);

        // Initialize slider tracks
        updateSliderTrack(sipAmountRange);
        updateSliderTrack(sipReturnRange);
        updateSliderTrack(sipYearsRange);

        calculateSIP();
    }

    // ===== LUMP SUM CALCULATOR =====
    const lsAmount = document.getElementById('lsAmount');
    const lsAmountRange = document.getElementById('lsAmountRange');
    const lsReturn = document.getElementById('lsReturn');
    const lsReturnRange = document.getElementById('lsReturnRange');
    const lsYears = document.getElementById('lsYears');
    const lsYearsRange = document.getElementById('lsYearsRange');

    const lsInvestedDisplay = document.getElementById('lsInvested');
    const lsReturnsDisplay = document.getElementById('lsReturns');
    const lsTotalDisplay = document.getElementById('lsTotal');

    let lsChart = null;

    function calculateLS() {
        const P = parseFloat(lsAmount?.value) || 0;
        const r = (parseFloat(lsReturn?.value) || 0) / 100;
        const n = parseInt(lsYears?.value) || 0;

        if (P <= 0 || r <= 0 || n <= 0) {
            if (lsInvestedDisplay) lsInvestedDisplay.textContent = '₹0';
            if (lsReturnsDisplay) lsReturnsDisplay.textContent = '₹0';
            if (lsTotalDisplay) lsTotalDisplay.textContent = '₹0';
            return;
        }

        // Compound interest: A = P(1+r)^n
        const totalValue = P * Math.pow(1 + r, n);
        const returns = totalValue - P;

        if (lsInvestedDisplay) lsInvestedDisplay.textContent = formatCurrency(P);
        if (lsReturnsDisplay) lsReturnsDisplay.textContent = formatCurrency(returns);
        if (lsTotalDisplay) lsTotalDisplay.textContent = formatCurrency(totalValue);

        if (lsChart) {
            lsChart.data.datasets[0].data = [P, returns];
            lsChart.update('none');
        } else {
            lsChart = createDoughnutChart(
                'lsChart',
                ['Invested Amount', 'Estimated Returns'],
                [P, returns],
                {
                    bg: ['#7c3aed', '#f97316'],
                    border: ['#6d28d9', '#ea6500']
                }
            );
        }
    }

    if (lsAmount) {
        syncSlider(lsAmount, lsAmountRange, calculateLS);
        syncSlider(lsReturn, lsReturnRange, calculateLS);
        syncSlider(lsYears, lsYearsRange, calculateLS);

        updateSliderTrack(lsAmountRange);
        updateSliderTrack(lsReturnRange);
        updateSliderTrack(lsYearsRange);

        calculateLS();
    }

    // ===== EMI CALCULATOR =====
    const emiAmount = document.getElementById('emiAmount');
    const emiAmountRange = document.getElementById('emiAmountRange');
    const emiRate = document.getElementById('emiRate');
    const emiRateRange = document.getElementById('emiRateRange');
    const emiYears = document.getElementById('emiYears');
    const emiYearsRange = document.getElementById('emiYearsRange');

    const emiMonthlyDisplay = document.getElementById('emiMonthly');
    const emiInterestDisplay = document.getElementById('emiInterest');
    const emiTotalDisplay = document.getElementById('emiTotal');

    let emiChart = null;

    function calculateEMI() {
        const P = parseFloat(emiAmount?.value) || 0;
        const annualRate = parseFloat(emiRate?.value) || 0;
        const years = parseInt(emiYears?.value) || 0;

        if (P <= 0 || annualRate <= 0 || years <= 0) {
            if (emiMonthlyDisplay) emiMonthlyDisplay.textContent = '₹0';
            if (emiInterestDisplay) emiInterestDisplay.textContent = '₹0';
            if (emiTotalDisplay) emiTotalDisplay.textContent = '₹0';
            return;
        }

        // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        const r = annualRate / 100 / 12;
        const n = years * 12;
        const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        if (emiMonthlyDisplay) emiMonthlyDisplay.textContent = formatCurrency(emi);
        if (emiInterestDisplay) emiInterestDisplay.textContent = formatCurrency(totalInterest);
        if (emiTotalDisplay) emiTotalDisplay.textContent = formatCurrency(totalPayment);

        if (emiChart) {
            emiChart.data.datasets[0].data = [P, totalInterest];
            emiChart.update('none');
        } else {
            emiChart = createDoughnutChart(
                'emiChart',
                ['Principal Amount', 'Total Interest'],
                [P, totalInterest],
                {
                    bg: ['#7c3aed', '#ef4444'],
                    border: ['#6d28d9', '#dc2626']
                }
            );
        }
    }

    if (emiAmount) {
        syncSlider(emiAmount, emiAmountRange, calculateEMI);
        syncSlider(emiRate, emiRateRange, calculateEMI);
        syncSlider(emiYears, emiYearsRange, calculateEMI);

        updateSliderTrack(emiAmountRange);
        updateSliderTrack(emiRateRange);
        updateSliderTrack(emiYearsRange);

        calculateEMI();
    }

    // ===== YEAR BREAKDOWN TABLE (NEW FEATURE) =====
    function updateBreakdownTable(monthly, rate, years) {
        const tbody = document.getElementById('breakdownBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const r = rate / 100 / 12;
        const maxYears = Math.min(years, 40);

        // Find max value for bar scaling
        const finalMonths = maxYears * 12;
        const finalValue = monthly *
            (Math.pow(1 + r, finalMonths) - 1) / r * (1 + r);

        for (let yr = 1; yr <= maxYears; yr++) {
            const months = yr * 12;
            const invested = monthly * months;
            const value = monthly *
                (Math.pow(1 + r, months) - 1) / r * (1 + r);
            const returns = value - invested;
            const growthPct = invested > 0
                ? ((returns / invested) * 100).toFixed(1)
                : '0.0';
            const barWidth = Math.round((value / finalValue) * 80);

            const isLast = yr === maxYears;
            const row = document.createElement('tr');
            if (isLast) row.classList.add('highlight-row');

            row.innerHTML = `
                <td><strong>Year ${yr}</strong></td>
                <td>${formatCurrency(invested)}</td>
                <td style="color:#16a34a;font-weight:600">
                    +${formatCurrency(returns)}
                </td>
                <td><strong>${formatCurrency(value)}</strong></td>
                <td>
                    <div class="growth-bar">
                        <div class="growth-fill"
                             style="width:${barWidth}px">
                        </div>
                        <span style="color:#16a34a;font-size:0.8rem;font-weight:600">
                            +${growthPct}%
                        </span>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        }
    }

    // ===== PDF DOWNLOAD (NEW FEATURE) =====
    window.downloadBreakdown = function() {
        const monthly = parseFloat(
            document.getElementById('sipAmount')?.value
        ) || 5000;
        const rate = parseFloat(
            document.getElementById('sipReturn')?.value
        ) || 12;
        const years = parseInt(
            document.getElementById('sipYears')?.value
        ) || 10;

        const invested = monthly * years * 12;
        const r = rate / 100 / 12;
        const n = years * 12;
        const total = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const returns = total - invested;

        // Simple printable version
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to download the report.');
            return;
        }

        const tableRows = [];
        for (let yr = 1; yr <= years; yr++) {
            const months = yr * 12;
            const inv = monthly * months;
            const val = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
            const ret = val - inv;
            const pct = ((ret / inv) * 100).toFixed(1);
            tableRows.push(`
                <tr>
                    <td>Year ${yr}</td>
                    <td>₹${Math.round(inv).toLocaleString('en-IN')}</td>
                    <td>₹${Math.round(ret).toLocaleString('en-IN')}</td>
                    <td>₹${Math.round(val).toLocaleString('en-IN')}</td>
                    <td>+${pct}%</td>
                </tr>
            `);
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>NandiIndia SIP Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        color: #1e293b;
                    }
                    h1 { color: #1a56db; margin-bottom: 8px; }
                    .summary {
                        display: flex;
                        gap: 24px;
                        margin: 20px 0;
                        padding: 20px;
                        background: #f5f3ff;
                        border-radius: 10px;
                    }
                    .s-item { flex: 1; }
                    .s-item label {
                        font-size: 12px;
                        color: #64748b;
                        display: block;
                    }
                    .s-item strong {
                        font-size: 18px;
                        color: #7c3aed;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th {
                        background: #7c3aed;
                        color: white;
                        padding: 10px 12px;
                        text-align: left;
                        font-size: 13px;
                    }
                    td {
                        padding: 9px 12px;
                        border-bottom: 1px solid #e2e8f0;
                        font-size: 13px;
                    }
                    tr:nth-child(even) td { background: #f8fafc; }
                    tr:last-child td {
                        font-weight: 700;
                        color: #7c3aed;
                        background: #f5f3ff;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 11px;
                        color: #94a3b8;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 12px;
                    }
                </style>
            </head>
            <body>
                <h1>📊 NandiIndia — SIP Investment Report</h1>
                <p>Generated on ${new Date().toLocaleDateString('en-IN')}</p>
                <div class="summary">
                    <div class="s-item">
                        <label>Monthly SIP</label>
                        <strong>₹${monthly.toLocaleString('en-IN')}</strong>
                    </div>
                    <div class="s-item">
                        <label>Expected Return</label>
                        <strong>${rate}% p.a.</strong>
                    </div>
                    <div class="s-item">
                        <label>Duration</label>
                        <strong>${years} Years</strong>
                    </div>
                    <div class="s-item">
                        <label>Total Invested</label>
                        <strong>₹${Math.round(invested).toLocaleString('en-IN')}</strong>
                    </div>
                    <div class="s-item">
                        <label>Total Wealth</label>
                        <strong>₹${Math.round(total).toLocaleString('en-IN')}</strong>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Invested</th>
                            <th>Returns</th>
                            <th>Total Value</th>
                            <th>Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows.join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <p>⚠️ Disclaimer: Returns shown are estimated based on expected rate. 
                    Actual returns may vary. Mutual fund investments are subject to market risk. 
                    Please read all scheme documents carefully.</p>
                    <p>© NandiIndia | Associated with NJ Wealth | 
                    Generated: ${new Date().toLocaleString('en-IN')}</p>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    };
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

});