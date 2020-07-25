var showMap = true;

var centerPos = {lat: 42.408, lng: -71.109}; // center of Tufts

var fillerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur facilisis facilisis neque, et mollis sem luctus eget. Proin pellentesque enim mollis, eleifend quam eget, dignissim ex. Maecenas ut leo ut neque porttitor aliquet rutrum sit amet dui. Mauris lacinia risus accumsan porttitor tincidunt. Nunc at fermentum purus. Maecenas rutrum, eros eget varius eleifend, erat dolor imperdiet elit, sed lacinia augue eros ut nulla. Mauris in erat sed dolor ullamcorper vulputate. Nunc dignissim arcu nec enim interdum rutrum. Aenean volutpat facilisis ex id vestibulum. Nulla quis elit auctor ante venenatis fermentum. Sed lobortis tempor mauris, dignissim venenatis nisi. Aenean et metus tincidunt, laoreet ipsum vitae, ultricies tellus.";

var tagList = [
    {name: "Gym Battle", color: "red"}, 
    {name: "Raid", color: "green"}, 
    {name: "Legendary Pokémon", color: "gold"}
];

var mapIcon = null;
var addLoc = null;

if (sessionStorage['eventList'] == undefined) {
    var eventList = [
        {name: "Event #0", details: fillerText, date: "Apr 28 2020 8:00 PM", location: {lat: 42.405, lng: -71.101}, tags: [0]},
        {name: "Event #1", details: fillerText, date: "Apr 28 2020 11:00 PM", location: {lat: 42.4098528, lng: -71.1056618}, tags: [2]},
        {name: "Event #2", details: fillerText, date: "Apr 28 2020 9:00 PM", location: {lat: 42.3972332, lng: -71.1236188}, tags: [1, 2]},
        {name: "Event #3", details: fillerText, date: "May 05 2020 6:00 AM", location: {lat: 42.4082542, lng: -71.116261}, tags: [2]},
        {name: "Event #4", details: fillerText, date: "May 05 2020 2:00 PM", location: {lat: 42.406247, lng: -71.1183103}, tags: [1]},
        {name: "Event #5", details: fillerText, date: "May 07 2020 10:00 AM", location: {lat: 42.4049163, lng: -71.1213513}, tags: [0, 2]},
        {name: "Event #6", details: fillerText, date: "May 17 2020 12:30 PM", location: {lat: 42.407516, lng: -71.1088165}, tags: [0]}
    ];
    saveSession('eventList', eventList);
}

// for user location
// https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
function initMap() {
    // $('#map') returns a jQuery object, $('#map').get(0) returns the actual DOM object
    var map = new google.maps.Map($('#map').get(0), {
        zoom: 14,
        center: centerPos
    });

    mapIcon = {
        url: 'https://i.ya-webdesign.com/images/pokemon-go-icon-png-10.png',
        // This marker is 20 pixels wide by 32 pixels high.
        scaledSize: new google.maps.Size(36, 42),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(18, 42)
    };


    var eventList = getSession('eventList');

    eventList.forEach(function(event, i) {
        var marker = new google.maps.Marker({
            position: event.location,
            map: map,
            title: event.name, 
            icon: mapIcon
        });

        marker.addListener('click', function() {
            clickHandler(i);
        });
    });
}

function initAddMap() {
    var map = new google.maps.Map($('#map').get(0), {
        zoom: 16,
        center: centerPos
    });

    mapIcon = {
        url: 'https://i.ya-webdesign.com/images/pokemon-go-icon-png-10.png',
        scaledSize: new google.maps.Size(36, 42),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(18, 42)
    };

    var addMarker = null;

    map.addListener('click', function(event) {
        if (addMarker == null) {
            addMarker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                icon: mapIcon
            }); 
        } 
        else {
            addMarker.setPosition(event.latLng);
        }
        addLoc = event.latLng;
    });
}

// open details about event and zoom in on map
function clickHandler(id) {
    /*$(".card").fadeOut(400);*/
    $(".card").hide();

    var eventList = getSession('eventList');

    if (showMap) {
        var map = new google.maps.Map($('#map').get(0), {
            zoom: 17,
            center: eventList[id].location
        });
        var marker = new google.maps.Marker({
            position: eventList[id].location,
            map: map,
            title: eventList[id].name, 
            icon: mapIcon
        });

        marker.addListener('click', function() {
            clickHandler(id);
        });
    }

    $(".event-detail[value='"+id+"']").fadeIn(900);
    // wait for fade out before fading in
    /*var checkExist = setInterval(function() {
        if (!$(".card").is(":visible")) {
            $(".event-detail[value='"+id+"']").fadeIn(200);
            clearInterval(checkExist);
        }
    }, 100);*/
}

function saveSession(key, val) {
    sessionStorage[key] = JSON.stringify(val);
}

function getSession(key) {
    return JSON.parse(sessionStorage[key]);
}

$(document).ready(function() {
    // generate tag filter menu dynamically
    tagList.forEach(function(tag, i) {
        var $tagEntry = $('<div class="form-check-inline">');
        $tagEntry.append($("<input>", {class: 'form-check-input', id: 'checkbox'+i, type: 'checkbox', name: 'option'+i, value: i}));
        var $label = $("<label>", {class: 'form-check-label', for: 'checkbox'+i}).text('\n'+tag.name+'\n');
        var $icon = $('<i class="fas fa-square"></i>');
        $icon.css('color', tag.color);
        $label.append($icon);
        $tagEntry.append($label);
        $(".tag-filter").append($tagEntry);
        $(".tag-filter").append('\n');
    });
    $("#filter-form").append('<div style="margin: 10px 0 0"><button type="submit" class="btn btn-primary btn-block">Filter</button></div>');
    
    // generate event list and content dynamically
    getSession('eventList').forEach(function(event, i) {
        var $eventEntry = $("<div>", {class:'card'});
        var $header = $('<div class="card-body">');
        var $name = $('<h2 class="mb-0">');
        var $button = $("<button>", {class: "btn btn-link btn-event", type:"button", "data-value": i});
        $button.text('\n'+event.name+'\n');
        $name.append($button);

        var $date = $('<span style="float: right; color: RoyalBlue;">');
        $date.text('\n'+event.date+'\n');
        $date.append('&nbsp;<i class="far fa-calendar-alt"></i>');

        var $ul = $('<ul class="list-tag">');
        for (tag of event.tags) {
            $li = $('<li>');
            $li.text('\n'+tagList[tag].name+'\n');
            var $icon = $('<i class="fas fa-square"></i>');
            $icon.css('color', tagList[tag].color);
            $li.append($icon);
            $ul.append($li);
        }

        $header.append($name);
        $header.append($date);
        $header.append($ul);
        $eventEntry.append($header);

        var $eventContent = $("<div>", {class: "event-detail", value: i});
        $eventContent.append($('<button class="btn btn-link btn-back" type="button">\n&lt;&lt;Back to list\n</button>'));
        $eventContent.append($('<h2>\n'+event.name+'\n</h2>'));

        var $date = $('<span style="float: left; color: RoyalBlue;">');
        $date.append('<i class="far fa-calendar-alt"></i>&nbsp;');
        $date.append('\n'+event.date+'\n');

        var $ul = $('<ul class="list-tag-details">');
        for (tag of event.tags) {
            $li = $('<li>');
            $li.text('\n'+tagList[tag].name+'\n');
            var $icon = $('<i class="fas fa-square"></i>');
            $icon.css('color', tagList[tag].color);
            $li.append($icon);
            $ul.append($li);
        }
        $eventContent.append($date);
        $eventContent.append('<br>');
        $eventContent.append($ul);
        $eventContent.append('\n'+event.details+'\n');

        $("#eventSection").append($eventEntry);
        $("#eventSection").append('\n');
        $("#eventSection").append($eventContent);
        $("#eventSection").append('\n');
    });

    // collapse sidebar menu if user clicks anywhere else
    $("body").click(function(e) {    
        if (e.target.id == "hamburger" || $(e.target).closest('#hamburger').length ||
            e.target.id == "collapse" || $(e.target).closest('#collapse').length) {
            return;
        }

        $("#collapse").slideUp(350);
    });

    // toggle sidebar menu
    $("#hamburger").click(function() {
        console.log("dafaq?");
        $("#collapse").slideToggle(350);
    });

    // handle clicks on event tabs
    $(".btn-event").click(function() {
        var id = $(this).data("value");
        clickHandler(id);
    });

    // go back to event tabs
    $(".btn-back").click(function() {
        /*var id = $(this).data("value");
        $(".event-detail[value='"+id+"']").fadeOut(400);*/
        $(".event-detail").hide();
        var eventList = getSession('eventList');

        if (showMap) {
            var map = new google.maps.Map($('#map').get(0), {
                zoom: 14,
                center: centerPos
            });
            eventList.forEach(function(event, i) {
                var marker = new google.maps.Marker({
                    position: event.location,
                    map: map,
                    title: event.name, 
                    icon: mapIcon
                });

                marker.addListener('click', function() {
                    clickHandler(i);
                });
            });
        }

        $(".card").fadeIn(900);

        // wait for fade out before fading in
        /*var checkExist = setInterval(function() {
            if (!$(".event-detail[value='"+id+"']").is(":visible")) {
                $(".card").fadeIn(200);
                clearInterval(checkExist);
            }
        }, 100);*/
        
    });

    // display events that match filters
    $("#filter-form").submit(function(event) {
        // prevent submitting the form (POST method)
        event.preventDefault();

        $(".event-detail").hide();

        var eventList = getSession('eventList');

        if (showMap) {
            var map = new google.maps.Map($('#map').get(0), {
                zoom: 14,
                center: centerPos
            });
        }

        var tags = $(this).serializeArray();
        var showMarker = new Array(eventList.length).fill(true);

        $('.card').each(function(i, obj) {
            for (tag of tags) {
                if (!eventList[i].tags.includes(Number(tag.value))) {
                    showMarker[i] = false;
                    $(this).slideUp(300);
                }
            }
            if (showMarker[i]) {
                $(this).slideDown(300);
            }
        });

        if (showMap) {
            for (i in showMarker) {
                if (showMarker[i]) {
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
        }
    });

    // display events that match filters
    $("#add-event").submit(function(event) {
        // prevent submitting the form (POST method)
        event.preventDefault();

        var tags = $(this).serializeArray();
        var arr = [];
        for (tag of tags) {
            arr.push(tag.value);
        }

        var date = $("#add-date").datepicker("getDate");
        var time = $("#time option:selected").text();

        var newEvent = {
            name: $("#eventname").val(), 
            details: $("#description").val(), 
            date: date.toDateString().substring(4) + ' ' + time,
            location: addLoc, 
            tags: arr
        };

        console.log(newEvent);
        
        var eventList = getSession('eventList');
        eventList.push(newEvent);
        saveSession('eventList', eventList);
        addLoc = null;
        window.location.replace("LandingPage.html");
    });
});
