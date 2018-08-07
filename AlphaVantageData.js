(function () {
   
    $(document).ready(function () {
         var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "open",
            alias: "Open",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "high",
            alias: "High",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "date",
            alias: "Date",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "low",
            alias: "Low",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "close",
            alias: "Close",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "volume",
            alias: "Volume",
            dataType: tableau.dataTypeEnum.string
        }];
    
        var tableSchema = {
            id: "timeSeriesDaily",
            alias: "Stock Datas",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
        
        const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+tableau.connectionData+'&apikey=QYOWP5SXIHB6BV3X'
        //const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=QYOWP5SXIHB6BV3X'
        $.ajax({
            dataType: "json",
            url: url,
            data: {},
            success: function(data) {
                const allRows = []
                const timeSeries = data['Time Series (Daily)']
                const keys = Object.keys(timeSeries)
                for (var i = 0 ; i < keys.length ; i++) {
                    const key = keys[i]
                    const actual = timeSeries[key]
                    const expected = {}
                    expected.open = actual['1. open'] ? actual['1. open'] : '--'
                    expected.high = actual['2. high'] ? actual['2. high'] : '--'
                    expected.low = actual['3. low'] ? actual['3. low'] : '--'
                    expected.close = actual['4. close'] ? actual['4. close'] : '--'
                    expected.volume = actual['5. volume'] ? actual['5. volume'] : '--'
                    expected.date = key 
                    allRows.push(expected)
                    }
                    
                table.appendRows(allRows)
                doneCallback();
            }
        });
    };

    tableau.registerConnector(myConnector);

        $("#submitButton").click(function () {
            tableau.connectionData = $("#submitSymbol").val();
  
            tableau.connectionName = "AV'+tableau.connectionData+'Feed";
            tableau.submit();
        });
    });
})();
