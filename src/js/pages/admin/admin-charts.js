// Admin Panel Chart Methods
// Chart rendering and data generation for analytics

/**
 * Mixin function to add chart methods to AdminPanel
 */
export function mixinChartMethods(AdminPanelClass) {
    
    AdminPanelClass.prototype.setupCharts = function() {
        // Simple chart implementation (in a real app, you'd use Chart.js or similar)
        this.setupBookingChart();
    };

    AdminPanelClass.prototype.setupBookingChart = function() {
        const canvas = document.getElementById('bookingChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getBookingChartData();
        
        // Simple line chart implementation
        this.drawLineChart(ctx, data, canvas.width, canvas.height);
    };

    AdminPanelClass.prototype.setupAnalyticsCharts = function() {
        // Revenue chart
        const revenueCanvas = document.getElementById('revenueChart');
        if (revenueCanvas) {
            const ctx = revenueCanvas.getContext('2d');
            const data = this.getRevenueChartData();
            this.drawLineChart(ctx, data, revenueCanvas.width, revenueCanvas.height);
        }

        // Tour performance chart
        const performanceCanvas = document.getElementById('tourPerformanceChart');
        if (performanceCanvas) {
            const ctx = performanceCanvas.getContext('2d');
            const data = this.getTourPerformanceData();
            this.drawBarChart(ctx, data, performanceCanvas.width, performanceCanvas.height);
        }

        // Demographics chart
        const demographicsCanvas = document.getElementById('demographicsChart');
        if (demographicsCanvas) {
            const ctx = demographicsCanvas.getContext('2d');
            const data = this.getDemographicsData();
            this.drawPieChart(ctx, data, demographicsCanvas.width, demographicsCanvas.height);
        }

        // Booking trends chart
        const trendsCanvas = document.getElementById('bookingTrendsChart');
        if (trendsCanvas) {
            const ctx = trendsCanvas.getContext('2d');
            const data = this.getBookingTrendsData();
            this.drawLineChart(ctx, data, trendsCanvas.width, trendsCanvas.height);
        }
    };

    // Simple chart drawing methods
    AdminPanelClass.prototype.drawLineChart = function(ctx, data, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        const maxValue = Math.max(...data.values);
        const minValue = Math.min(...data.values);
        const valueRange = maxValue - minValue;
        
        // Draw axes
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw line
        ctx.strokeStyle = '#2c5aa0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.values.forEach((value, index) => {
            const x = padding + (index / (data.values.length - 1)) * chartWidth;
            const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#2c5aa0';
        data.values.forEach((value, index) => {
            const x = padding + (index / (data.values.length - 1)) * chartWidth;
            const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    AdminPanelClass.prototype.drawBarChart = function(ctx, data, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const barWidth = chartWidth / data.labels.length * 0.8;
        const barSpacing = chartWidth / data.labels.length;
        
        const maxValue = Math.max(...data.values);
        
        data.values.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
            const y = height - padding - barHeight;
            
            ctx.fillStyle = '#2c5aa0';
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    };

    AdminPanelClass.prototype.drawPieChart = function(ctx, data, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        
        const total = data.values.reduce((sum, value) => sum + value, 0);
        let currentAngle = 0;
        
        const colors = ['#2c5aa0', '#ff6b35', '#28a745', '#ffc107', '#dc3545'];
        
        data.values.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
    };

    // Data generation methods
    AdminPanelClass.prototype.getBookingChartData = function() {
        return {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [12, 19, 8, 15, 22, 18, 25]
        };
    };

    AdminPanelClass.prototype.getRevenueChartData = function() {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [8500, 9200, 7800, 10500, 11200, 12800]
        };
    };

    AdminPanelClass.prototype.getTourPerformanceData = function() {
        return {
            labels: ['Gobustan', 'Old City', 'Qabala', 'Shamakhi', 'Baku Night'],
            values: [45, 38, 32, 28, 25]
        };
    };

    AdminPanelClass.prototype.getDemographicsData = function() {
        return {
            labels: ['Russia', 'Turkey', 'UK', 'Germany', 'Others'],
            values: [35, 25, 15, 12, 13]
        };
    };

    AdminPanelClass.prototype.getBookingTrendsData = function() {
        return {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            values: [45, 52, 38, 61]
        };
    };
}

