var showMap = true;
var dateFrom = new Date();
dateFrom.setHours(0);dateFrom.setMinutes(0);dateFrom.setSeconds(0);
var dateTo = new Date(); dateTo.setMonth(dateFrom.getMonth() + 1);


function filterDate() {
    dateTo.setHours(23);dateTo.setMinutes(59);dateTo.setSeconds(59);

    $(".event-detail").hide();

    var eventList = getSession('eventList');

    if (showMap) {
        var map = new google.maps.Map($('#map').get(0), {
            zoom: 14,
            center: centerPos
        });
    }

    $('.card').each(function(i, obj) {
        var eventDate = new Date(Date.parse(eventList[i].date));

        if (eventDate >= dateFrom && eventDate <= dateTo) {
            $(this).slideDown(300);
            if (showMap) {
                var marker = new google.maps.Marker({
                    position: eventList[i].location,
                    map: map,
                    title: eventList[i].name, 
                    icon: mapIcon
                });

                marker.addListener('click', function() {
                    clickHandler(i);
                });
            }
        }
        else {
            $(this).slideUp(300);
        }
    });
}


$(document).ready(function() {
    var $time = $('#time');
    var i;
    for (i = 2; i < 48; i++) {
        var min = i%2 == 0 ? '00 ' : '30 ';
        var ap = Math.trunc(i/24) == 0 ? 'AM' : 'PM';
        var hr = Math.trunc(i/2)%12 == 0 ? '12' : Math.trunc(i/2)%12;
        $time.append('<option>'+ hr + ':' + min + ap +'</option>');
    }

    var calendarFrom = $("input[name='from']").datepicker({
        format: 'M dd yyyy',
        startDate: dateFrom.toDateString().substring(4),
        defaultViewDate: dateFrom.toDateString().substring(4),
        container: $('#calendarFrom'),
        todayHighlight: true,
        autoclose: true,
    });

    var calendarTo = $("input[name='to']").datepicker({
        format: 'M dd yyyy',
        startDate: dateFrom.toDateString().substring(4),
        defaultViewDate : dateTo.toDateString().substring(4),
        container: $('#calendarTo'),
        todayHighlight: true,
        autoclose: true,
    });

    var calendarAdd = $("#add-date").datepicker({
        format: 'M dd yyyy',
        startDate: new Date().toDateString().substring(4),
        defaultViewDate : new Date().toDateString().substring(4),
        container: $('#calendarAdd'),
        todayHighlight: true,
        autoclose: true,
    });

    $("input[name='from']").datepicker("setDate", dateFrom);
    $("input[name='to']").datepicker("setDate", dateTo);
    $("#add-date").datepicker("setDate", new Date());

    calendarFrom.on("changeDate", function(e) {
        dateFrom = e.date;
        filterDate();
    });

    calendarTo.on("changeDate", function(e) {
        dateTo = e.date;
        filterDate();
    });

});
