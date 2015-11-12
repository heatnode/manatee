var LandingCtrl = function ($scope, db) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.info = {
        //hasidb: db.indexedDB,
        //hasws: db.webSQL,
        title: 'i am a title'
    }

    var pctFn = function () {
        return 100 * ((self.procStats.getTotal()) ? this.Actual / self.procStats.getTotal() : 0);
    }

    self.statObj = db.data;

    self.procStats = {
        NotTested: {
            Pct:  pctFn,
            Actual: 0
        },
        Passed: {
            Pct: pctFn,
            Actual: 0
        },
        Failed: {
            Pct: pctFn,
            Actual: 0
        },
        getTotal: function () {
            return this.Failed.Actual + this.Passed.Actual + this.NotTested.Actual;
        }
    };

    //self.procdata = db.

    $scope.$on('dbservicedata:updated', function () {
        //apply is necessary to trigger a digest which will update the values
        self.procStats.NotTested.Actual = db.data.untestedProcs;
        self.procStats.Passed.Actual = db.data.passingProcs;
        self.procStats.Failed.Actual = db.data.failingProcs;
        updatePieChart();
        updateBarChart();
        $scope.$apply();
    });

    db.updateStats();

    //testing probably would become a chart directive with its own controller
    //todo: add placehodlers for "no data" conditions
    function updatePieChart() {
        //Docs at http://www.chartjs.org 
        var pie_data = [
            {
                value: self.procStats.Passed.Actual,
                color: "#4DAF7C",
                highlight: "#55BC75",
                label: "Passing"
            },
            {
                value: self.procStats.NotTested.Actual,
                color: "#EAC85D",
                highlight: "#f9d463",
                label: "Not Tested"
            },
            {
                value: self.procStats.Failed.Actual,
                color: "#E25331",
                highlight: "#f45e3d",
                label: "Failing"
            }
            //{
            //    value: 35,
            //    color: "#F4EDE7",
            //    highlight: "#e0dcd9",
            //    label: "Remaining"
            //}
        ]
        // PIE CHART WIDGET
        var ctx = document.getElementById("myPieChart").getContext("2d");
        var myDoughnutChart = new Chart(ctx).Doughnut(pie_data,
                {
                    responsive: true,
                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>"
                });
    }

    function updateBarChart() {
        var stateObj = db.data.procWF; 
        var ctx = document.getElementById("myBarChart").getContext("2d");

        var data = {
            labels: [
                  'Not Started', 'In Progress', 'Completed', 'Reviewed'
            ],
            datasets: [
                {
                    label: 'Workflow State',
                    fillColor: 'rgba(4,151,179,0.5)',
                    highlightFill: 'rgba(0,163,124,0.5)',
                    data: [stateObj.NotStarted, stateObj.InProgress, stateObj.Completed, stateObj.Reviewed ]
                }
            ]
        };
        var options = {
            barStrokeWidth : 1,
            responsive: true,
            animation: true,
            barShowStroke: false
        };
        //var horizontalBarChart = new Chart(ctx).HorizontalBar(data, options);
        new Chart(ctx).Bar(data, options);
    
    }
    //endtesting
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
LandingCtrl.$inject = ['$scope', 'databaseSvc'];
