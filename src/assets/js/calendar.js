/*
  --------------------------------------------------------------------------------------
  UTILS: Função para criação dinamica de elementos no body
  --------------------------------------------------------------------------------------
  */

const twoDigitsString = (number) =>{
  return ("0"+number.toLocaleString("en-US",{minimumIntegerDigits:2})).slice(-2)
}


/*
  --------------------------------------------------------------------------------------
  Função para criação dinâmica do calendário

  O calendário é gerado pensando na coluna do dia, gerando todos os seus elementos
  e depois partindo para o dia seguinte
  --------------------------------------------------------------------------------------
*/
const generateCalendar = () => {
  const d = new Date();
  var calendar = document.getElementsByClassName('schedule_container')[0];
  
  appointmentsPerDay = 0;
  startHour = 8;
  finalHour = 20;
  appointmentTimeInMinutes = 60;
  appointmentsPerDay = (finalHour - startHour) * 60/appointmentTimeInMinutes;

  /*createAppointmentTimeNotes(calendar,appointmentsPerDay,startHour,finalHour,appointmentTimeInMinutes);*/
  i = 0
  for (var i = 0; i<7;i++){
    str_month = twoDigitsString(d.getMonth()+1)
    str_day =  d.getDate() + i
    currentDayOfWeek = d.getDay() + i
    task_date =str_day+"/"+str_month+"/"+d.getFullYear()


    newDiv = generateElement("div",calendar,{"class":"part_day"});
    generateCalendarHeader(newDiv,currentDayOfWeek);
    cards = generateCalendarHourCards(newDiv,task_date,appointmentsPerDay,startHour,appointmentTimeInMinutes,onHourCardClicked);
    generateRemoveBtnForEachCard(cards);
  } 
}

/*
  --------------------------------------------------------------------------------------
  Função auxiliar para criação dinâmica do cabeçalho do calendário

  Gera um elemento do cabeçalho representando o dia da seman
  --------------------------------------------------------------------------------------
*/

const generateCalendarHeader = (parentElement,weekday) =>{
  days = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  newSpan = generateElement("span",parentElement,{"class":"day"})
  newSpan.textContent = days[weekday%7];
}
/*
  --------------------------------------------------------------------------------------
  Função auxiliar para criação dinâmica do calendário

  Gera o cabeçalho com o dia da semana e cada card do calendário
  que representa um horário.
  --------------------------------------------------------------------------------------
*/
const generateCalendarHourCards = (newDiv,task_date,appointmentsPerDay,startingHour,appointmentDuration,onClickFunction) => {
  cards_generated = []
  for (var i = 0; i < appointmentsPerDay; i++) {
    scheduleInterval = (startingHour * 60 + i * appointmentDuration) 
    formatedTimeString = twoDigitsString(Math.floor(scheduleInterval/60))+":"+twoDigitsString(scheduleInterval % 60)

    taskDiv = generateElement("div",newDiv,{"class":"task",
                                          "task_date":task_date,
                                          "task_time":formatedTimeString})  
    timeSpan = generateElement("span",taskDiv,{"class":"time"})
    timeSpan.textContent = formatedTimeString;
    
    taskDiv.onclick = onClickFunction
    cards_generated.push(taskDiv)
  }
  return cards_generated
}

const generateRemoveBtnForEachCard = (listCards) =>{
  listCards.forEach(element => {
    removeBtn = generateElement("button",element,{"task_time": element.getAttribute("task_time"),
                                                  "task_date": element.getAttribute("task_date"),
                                                  "class": "delete-btn",
                                                  "id": "delete-btn"})
    removeBtn.onclick = function(e){
      deleteItem();
      e.stopPropagation();
    }
  });
}

const createAppointmentTimeNotes = (calendar,appointmentsPerDay,startingHour,finishingHour,appointmentDuration) => {
  newDiv = document.createElement("div")
  newDiv.classList.add("schedule_duration")
  calendar.appendChild(newDiv)
  for (var i = 0; i < appointmentsPerDay; i++) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("time");
    newDiv.appendChild(taskDiv);
    var span = document.createElement("span")
    span.setAttribute("task_time",i)
    spanTime = (startingHour *60 + i * appointmentDuration) 
    span.textContent = Math.floor(spanTime/60) + ":" + (spanTime % 60).toLocaleString("en-US",{minimumIntegerDigits:2})
    span.setAttribute("task_schedule",span.textContent)
    taskDiv.appendChild(span)
  }
}


const findCalendarElement = (schedule_date,schedule_time) =>{
  schedule_time = schedule_time.slice(0,-3);
  schedule_date = new Date(schedule_date)
  schedule_date = schedule_date.toLocaleString().split(",")[0]
  console.log(schedule_date)
  console.log(schedule_time)
  founded = document.querySelector('[task_date="'+schedule_date+'"][task_time="'+schedule_time+'"]');
  return founded
}

/*
  --------------------------------------------------------------------------------------
  Função a ser executada quando um card do calendário for clickado
  --------------------------------------------------------------------------------------
*/

const onHourCardClicked = (e) =>{
  clicked_time = e.target.getAttribute("task_time");
  clicked_date = e.target.getAttribute("task_date");
  
  console.log(clicked_date);
  console.log(clicked_time);
  e.target.setAttribute("id","scheduling");
  showScheduleForm(clicked_time,clicked_date);
}


generateCalendar();