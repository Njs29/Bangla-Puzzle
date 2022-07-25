/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.79797979797979, "KoPercent": 0.20202020202020202};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5636363636363636, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Product Page "], "isController": false}, {"data": [1.0, 500, 1500, "About Page-0"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "About Page-1"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "About Page-2"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "About Page-3"], "isController": false}, {"data": [0.0, 500, 1500, "Ar-Vr Page"], "isController": false}, {"data": [0.0, 500, 1500, "About Page"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "News Page-2"], "isController": false}, {"data": [0.95, 500, 1500, "News Page-1"], "isController": false}, {"data": [0.3, 500, 1500, "News Page-3"], "isController": false}, {"data": [0.975, 500, 1500, "Product Page -0"], "isController": false}, {"data": [0.975, 500, 1500, "Product Page -1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Product Page -2"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "Product Page -3"], "isController": false}, {"data": [0.0, 500, 1500, "Home Page"], "isController": false}, {"data": [0.0, 500, 1500, "News Page"], "isController": false}, {"data": [0.0, 500, 1500, "Home Page-1"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "Home Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "Ar-Vr Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "Ar-Vr Page-0"], "isController": false}, {"data": [0.39166666666666666, 500, 1500, "Ar-Vr Page-3"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "Ar-Vr Page-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "News Page-0"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "Contact Pgge-3"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "Healthcare Page-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "Contact Pgge-2"], "isController": false}, {"data": [0.5, 500, 1500, "Contact Pgge-1"], "isController": false}, {"data": [0.6, 500, 1500, "Contact Pgge-0"], "isController": false}, {"data": [0.0, 500, 1500, "Healthcare Page"], "isController": false}, {"data": [0.0, 500, 1500, "Contact Pgge"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "Healthcare Page-0"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "Healthcare Page-1"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "Healthcare Page-2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1980, 4, 0.20202020202020202, 1382.6843434343443, 237, 21706, 567.5, 3431.4000000000005, 4816.399999999994, 7212.310000000003, 48.30210772833723, 884.8965575600117, 9.708068037665887], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Product Page ", 60, 0, 0.0, 2688.783333333333, 1565, 5148, 2552.5, 4048.0, 4234.349999999999, 5148.0, 2.9491275497665277, 110.4837068382895, 1.4976038338658149], "isController": false}, {"data": ["About Page-0", 60, 0, 0.0, 274.6833333333334, 237, 444, 264.5, 328.3, 356.9999999999999, 444.0, 3.269220290960606, 3.0265828474908734, 0.3990747425489021], "isController": false}, {"data": ["About Page-1", 60, 0, 0.0, 282.76666666666665, 242, 974, 268.5, 300.9, 341.6999999999999, 974.0, 3.266017092156116, 3.090596252245387, 0.39868372706983835], "isController": false}, {"data": ["About Page-2", 60, 0, 0.0, 283.58333333333337, 243, 977, 264.0, 319.4, 366.84999999999997, 977.0, 3.2599837000814995, 3.030766096169519, 0.41068154034229826], "isController": false}, {"data": ["About Page-3", 60, 0, 0.0, 2264.5666666666657, 1049, 4097, 2117.5, 3419.6, 3560.7, 4097.0, 3.0461491597705233, 166.41801019825354, 0.38374340001015383], "isController": false}, {"data": ["Ar-Vr Page", 60, 0, 0.0, 2266.5333333333333, 1567, 6544, 2122.5, 2994.9, 3549.699999999998, 6544.0, 2.3243201363601145, 91.46789895986674, 1.2257156969086542], "isController": false}, {"data": ["About Page", 60, 0, 0.0, 3106.049999999999, 1815, 5197, 2921.5, 4193.5, 4894.849999999998, 5197.0, 2.9318348399706813, 168.3870518262888, 1.4544649401417054], "isController": false}, {"data": ["News Page-2", 60, 0, 0.0, 294.2666666666667, 237, 1083, 269.5, 313.7, 371.65, 1083.0, 3.3057851239669422, 3.070118801652893, 0.4132231404958678], "isController": false}, {"data": ["News Page-1", 60, 0, 0.0, 355.13333333333327, 239, 1608, 276.0, 374.79999999999995, 1369.1499999999978, 1608.0, 3.304328670558432, 3.123623196387267, 0.40013354995043504], "isController": false}, {"data": ["News Page-3", 60, 0, 0.0, 1609.2500000000007, 785, 3950, 1341.5, 2939.7999999999997, 3133.4, 3950.0, 3.2107882485150103, 115.8235421014609, 0.4013485310643763], "isController": false}, {"data": ["Product Page -0", 60, 0, 0.0, 311.3, 243, 1520, 268.0, 379.4, 403.79999999999995, 1520.0, 3.1781344350866045, 2.9515682107103127, 0.3972668043858255], "isController": false}, {"data": ["Product Page -1", 60, 0, 0.0, 316.61666666666684, 237, 1271, 267.5, 328.2, 993.5999999999976, 1271.0, 3.1798187503312314, 3.018343579415973, 0.39747734379140387], "isController": false}, {"data": ["Product Page -2", 60, 0, 0.0, 337.06666666666666, 241, 1485, 266.5, 347.09999999999997, 1145.45, 1485.0, 3.1843753317057635, 2.969803165799809, 0.41048588260269614], "isController": false}, {"data": ["Product Page -3", 60, 0, 0.0, 1723.35, 800, 4348, 1489.5, 3249.1, 3484.5499999999993, 4348.0, 3.140374751386999, 108.8222654205485, 0.40481393279598027], "isController": false}, {"data": ["Home Page", 60, 2, 3.3333333333333335, 6623.683333333333, 4110, 21706, 6166.0, 8332.9, 10030.05, 21706.0, 2.764212660093983, 158.40954114069842, 0.6583001243895698], "isController": false}, {"data": ["News Page", 60, 0, 0.0, 2590.1666666666665, 1560, 5015, 2404.5, 3766.1, 3997.1499999999996, 5015.0, 3.070310101320233, 119.3493101396991, 1.5111682529935522], "isController": false}, {"data": ["Home Page-1", 60, 2, 3.3333333333333335, 5951.299999999999, 3564, 21059, 5163.0, 7757.4, 9468.599999999999, 21059.0, 2.849002849002849, 160.6338660375119, 0.3334965574548908], "isController": false}, {"data": ["Home Page-0", 60, 0, 0.0, 670.3499999999998, 495, 2087, 585.5, 665.8, 1606.4999999999998, 2087.0, 22.615906520919715, 20.915296362608366, 2.7386449302676215], "isController": false}, {"data": ["Ar-Vr Page-1", 60, 0, 0.0, 270.19999999999993, 237, 355, 265.5, 309.7, 331.0, 355.0, 3.0671710459053263, 2.9263926873530313, 0.3983728018607504], "isController": false}, {"data": ["Ar-Vr Page-0", 60, 0, 0.0, 268.6500000000001, 239, 365, 264.5, 294.0, 334.1499999999999, 365.0, 3.070152995957632, 2.8662756485698204, 0.3987601059202784], "isController": false}, {"data": ["Ar-Vr Page-3", 60, 0, 0.0, 1446.9999999999995, 800, 5722, 1330.0, 2157.6, 2411.6999999999994, 5722.0, 2.3965489694839435, 87.53956802204824, 0.32063203986259786], "isController": false}, {"data": ["Ar-Vr Page-2", 60, 0, 0.0, 280.1833333333333, 237, 926, 269.0, 299.7, 332.59999999999997, 926.0, 3.0627871362940278, 2.8713629402756506, 0.40976741960183766], "isController": false}, {"data": ["News Page-0", 60, 0, 0.0, 330.9333333333334, 239, 1149, 281.0, 400.0, 984.5499999999981, 1149.0, 3.300511579294791, 3.0523285796798505, 0.3996713240552286], "isController": false}, {"data": ["Contact Pgge-3", 60, 0, 0.0, 1483.8166666666664, 810, 3962, 1288.0, 2403.7, 3021.9, 3962.0, 3.2041012495994874, 110.89507069048382, 0.4098996715796219], "isController": false}, {"data": ["Healthcare Page-3", 60, 0, 0.0, 1261.9999999999998, 798, 2810, 1148.5, 1726.1, 2269.499999999999, 2810.0, 2.9865604778496766, 94.34789540816327, 0.4170685042309607], "isController": false}, {"data": ["Contact Pgge-2", 60, 0, 0.0, 553.9000000000002, 268, 655, 541.0, 617.0, 640.4, 655.0, 3.40097494615123, 3.1684864244416735, 0.4350856620564562], "isController": false}, {"data": ["Contact Pgge-1", 60, 0, 0.0, 830.9333333333333, 726, 956, 824.0, 918.6999999999999, 944.75, 956.0, 3.3444816053511706, 3.1713785535117056, 0.41479410535117056], "isController": false}, {"data": ["Contact Pgge-0", 60, 0, 0.0, 534.4500000000002, 483, 688, 527.0, 588.9, 613.95, 688.0, 3.3952014486192845, 3.1498450939339064, 0.4210845546627433], "isController": false}, {"data": ["Healthcare Page", 60, 0, 0.0, 2137.199999999999, 1628, 4430, 2022.0, 2587.8, 3048.3999999999996, 4430.0, 2.8556470420256055, 98.33019013849888, 1.5728368473656658], "isController": false}, {"data": ["Contact Pgge", 60, 0, 0.0, 3405.1666666666665, 2463, 5888, 3132.5, 4284.3, 5055.849999999999, 5888.0, 2.945363506946149, 110.20951966030141, 1.4841870796720829], "isController": false}, {"data": ["Healthcare Page-0", 60, 0, 0.0, 290.2, 240, 921, 269.5, 346.0, 364.79999999999995, 921.0, 3.266906239790918, 3.0691052760535773, 0.44345699934661875], "isController": false}, {"data": ["Healthcare Page-1", 60, 0, 0.0, 298.26666666666665, 244, 1039, 270.5, 354.5, 408.54999999999995, 1039.0, 3.2658393207054215, 3.1350781760287396, 0.44331217341606793], "isController": false}, {"data": ["Healthcare Page-2", 60, 0, 0.0, 286.2333333333334, 239, 1014, 266.0, 317.5, 362.0499999999999, 1014.0, 3.2645954622123075, 3.0796867348604384, 0.455895655367539], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.banglapuzzle.com:443 [www.banglapuzzle.com/198.54.126.144] failed: Connection timed out: connect", 4, 100.0, 0.20202020202020202], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1980, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.banglapuzzle.com:443 [www.banglapuzzle.com/198.54.126.144] failed: Connection timed out: connect", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home Page", 60, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.banglapuzzle.com:443 [www.banglapuzzle.com/198.54.126.144] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Home Page-1", 60, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.banglapuzzle.com:443 [www.banglapuzzle.com/198.54.126.144] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
