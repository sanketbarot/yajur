/* ============================================
   NANDIINDIA - SIP CALCULATOR JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

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

    // Sync input and range
    function syncInputs() {
        sipAmount.addEventListener('input', () => {
            sipAmountRange.value = sipAmount.value;
            calculateSIP();
        });
        sipAmountRange.addEventListener('input', () => {
            sipAmount.value = sipAmountRange.value;
            calculateSIP();
        });

        sipReturn.addEventListener('input', () => {
            sipReturnRange.value = sipReturn.value;
            calculateSIP();
        });
        sipReturnRange.addEventListener('input', () => {
            sipReturn.value = sipReturnRange.value;
            calculateSIP();
        });

        sipYears.addEventListener('input', () => {
            sipYearsRange.value = sipYears.value;
            calculateSIP();
        });
        sipYearsRange.addEventListener('input', () => {
            sipYears.value = sipYearsRange.value;
            calculateSIP();
        });
    }

    // SIP Calculation
    function calculateSIP() {
        const P = parseFloat(sipAmount.value) || 0;
        const r = (parseFloat(sipReturn.value) || 0) / 100 / 12;
        const n = (parseInt(sipYears.value) || 0) * 12;

        if (P <= 0 || r <= 0 || n <= 0) {
            investedDisplay.textContent = '₹0';
            returnsDisplay.textContent = '₹0';
            totalDisplay.textContent = '₹0';
            return;
        }

        const invested = P * n;
        const totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const returns = totalValue - invested;

        // Animate numbers
        animateValue(investedDisplay, invested);
        animateValue(returnsDisplay, returns);
        animateValue(totalDisplay, totalValue);

        // Update chart
        updateChart(invested, returns);

        // Update slider track colors
        updateSliderTrack(sipAmountRange);
        updateSliderTrack(sipReturnRange);
        updateSliderTrack(sipYearsRange);
    }

    // Animate number display
    function animateValue(element, target) {
        const formatted = formatCurrency(Math.round(target));
        element.textContent = formatted;
    }

    // Format currency
    function formatCurrency(amount) {
        if (amount >= 10000000) {
            return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
        } else if (amount >= 100000) {
            return '₹' + (amount / 100000).toFixed(2) + ' L';
        } else {
            return '₹' + amount.toLocaleString('en-IN');
        }
    }

    // Update Chart
    function updateChart(invested, returns) {
        const ctx = document.getElementById('sipChart');
        if (!ctx) return;

        if (sipChart) {
            sipChart.data.datasets[0].data = [invested, returns];
            sipChart.update();
        } else {
            sipChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Invested Amount', 'Estimated Returns'],
                    datasets: [{
                        data: [invested, returns],
                        backgroundColor: ['#1a56db', '#0ea5e9'],
                        borderColor: ['#1341a8', '#0284c7'],
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
                                    family: "'Inter', sans-serif",
                                    size: 12,
                                    weight: '500'
                                },
                                color: '#374151'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            titleFont: {
                                family: "'Poppins', sans-serif",
                                size: 13,
                                weight: '600'
                            },
                            bodyFont: {
                                family: "'Inter', sans-serif",
                                size: 12
                            },
                            padding: 12,
                            cornerRadius: 10,
                            callbacks: {
                                label: function(context) {
                                    return ' ' + formatCurrency(Math.round(context.parsed));
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 800
                    }
                }
            });
        }
    }

    // Update slider track color
    function updateSliderTrack(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        const percentage = ((val - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, #2563eb ${percentage}%, #e5e7eb ${percentage}%)`;
    }

    // Initialize
    syncInputs();
    calculateSIP();

});