// GIVEN I am using a daily planner to create a schedule
// WHEN I open the planner
// THEN the current day is displayed at the top of the calendar
// WHEN I scroll down
// THEN I am presented with timeblocks for standard business hours
// WHEN I view the timeblocks for that day
// THEN each timeblock is color coded to indicate whether it is in the past, present, or future
// WHEN I click into a timeblock
// THEN I can enter an event
// WHEN I click the save button for that timeblock
// THEN the text for that event is saved in local storage
// WHEN I refresh the page
// THEN the saved events persist

// Set the business hours
const business = { start: 8, end: 18 };

var values, dateKey;

function init(now=moment()) {
    // Add the current date to top of screen
    $('#currentDay').text(now.format('dddd, MMMM Do'));

    // Get values from local storage
    var localStr = localStorage.getItem('schedulerData') || "{}";
    values = JSON.parse(localStr);
    dateKey = now.format('YYYYMMDD');
    if (!(dateKey in values)) values[dateKey] = {};

    container.on('click', event => {
        if (event.target.matches('.saveBtn')) {
            var button = event.target;
            var hr = button.dataset.hr;
            var inputValue = $(`#event-input-${hr}`)[0].value;
            values[dateKey][hr] = inputValue;
            localStorage.setItem('schedulerData', JSON.stringify(values));
        }
    })

    localStorage.setItem('schedulerData', JSON.stringify(values));

    setAlarm(now);
}

init()

var timer

function setAlarm(now=moment()) {
    // Update display at the start of the next hour
    var startOfNextHour = now.clone().endOf('hour').add(1, 'second');
    var durationToNextHour = startOfNextHour - now;
    timer = setInterval(function() {
        clearInterval(timer);
        updateDisplay(startOfNextHour);
    }, durationToNextHour)
}

function updateDisplay(now=moment()) {
    // Get the current hour
    var hour = now.hour();

    // Update each color
    var cells = $('.info-column');
    console.log(cells);
    for (let i = 0, hr = business.start; i < cells.length; i++, hr++) {
        let cell = $(cells[i]);
        cell.removeClass(['past', 'present', 'future']);
        cell.addClass(hour > hr ? 'past' : hour < hr ? 'future' : 'present');
    }
    
    setAlarm(now)
}