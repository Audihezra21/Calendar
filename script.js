const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventRepetisi = document.querySelector(".event-repetisi"),
  addEventSet = document.querySelector(".event-set"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const eventsArr = [];
getEvents();
console.log(eventsArr);

// Function to initialize the calendar
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      days += `<div class="day today active${event ? ' event' : ''}">${i}</div>`;
    } else {
      days += `<div class="day${event ? ' event' : ''}">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

// Function to add active class on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      events += `<div class="event">
          <div class="title">
            <i class="fas fa-circle"></i>
            <h3 class="event-title">${event.title}</h3>
          </div>
          <div class="event-time">
            Repetisi: <span class="event-repetisi">${event.repetisi}</span> -
            Set: <span class="event-set">${event.set}</span>
          </div>
      </div>`;
    }
  });
  if (events === "") {
    events = `<div class="no-event">
        <h3>No Events</h3>
    </div>`;
  }
  eventsContainer.innerHTML = events;
}


addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

addEventRepetisi.addEventListener("input", (e) => {
  addEventRepetisi.value = addEventRepetisi.value.replace(/[^0-9]/g, "");
});

addEventSet.addEventListener("input", (e) => {
  addEventSet.value = addEventSet.value.replace(/[^0-9x\s]/g, ""); // Hanya angka, x, dan spasi
});

addEventSubmit.addEventListener("click", async () => {
  const eventTitle = addEventTitle.value;
  const eventRepetisi = addEventRepetisi.value;
  const eventSet = addEventSet.value;

  if (eventTitle === "" || eventRepetisi === "" || eventSet === "") {
    alert("Please fill all the fields");
    return;
  }

  const newEvent = {
    title: eventTitle,
    repetisi: eventRepetisi,
    set: eventSet,
    day: activeDay,
    month: month + 1,
    year: year,
  };

  await addEvent(newEvent);

  // Memperbarui data eventsArr dan tampilan
  eventsArr.push(newEvent); // Tambahkan event baru ke array
  updateEvents(activeDay);
  addEventTitle.value = "";
  addEventRepetisi.value = "";
  addEventSet.value = "";
  addEventWrapper.classList.remove("active");

  // Select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

// Update the delete event function
eventsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      const eventToDelete = eventsArr.find(event => event.events.some(item => item.title === eventTitle));
      if (eventToDelete) {
        await deleteEvent(eventToDelete.id);
        updateEvents(activeDay);
      }
    }
  }
});


function getEvents() {
  const events = localStorage.getItem("events");
  if (events) {
    const parsedEvents = JSON.parse(events);
    parsedEvents.forEach((event) => {
      eventsArr.push(event);
    });
  }
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

initCalendar();

// Function to delete event



// Database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnvmhonxufurmocduifg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indudm1ob254dWZ1cm1vY2R1aWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4MDg4MjgsImV4cCI6MjAzODM4NDgyOH0.NiqWMZXMygG4kjS5ofarmPf8oA7CmnQxoxHCuKqUPpE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk mendapatkan data acara
async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*');
  if (error) {
    console.error('Error fetching events:', error);
  } else {
    console.log(data); // Pastikan data ditampilkan di console
    return data;
  }
}


// Fungsi untuk menambahkan acara
async function addEvent(event) {
  const { data, error } = await supabase
    .from('events')
    .insert([event]);
  if (error) {
    console.error('Error adding event:', error);
  } else {
    return data;
  }
}

// Fungsi untuk menghapus acara
async function deleteEvent(id) {
  const { data, error } = await supabase
    .from('events')
    .delete()
    .match({ id });
  if (error) {
    console.error('Error deleting event:', error);
  } else {
    return data;
  }
}

// Panggil fungsi ini saat halaman dimuat
(async function() {
  eventsArr = await getEvents(); // Perbarui eventsArr dengan data dari database
  initCalendar(); // Inisialisasi kalender dengan data terbaru
})();

