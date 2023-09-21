
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de agendamentos existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/


const getList = async () => {
  let url = 'http://127.0.0.1:5000/agendamentos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.agendamentos.forEach(item => insertList(item.Doutor, item.Paciente, item.Plano,item.Consultorio, item.Contato, item.Dia, item.Horario))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}



/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de doutores existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getDoctors = async () => {
  let url = 'http://127.0.0.1:5000/doutores';
  removeOptions(document.getElementById('newDoctor'));
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.doutores.forEach(item => insertOptions('newDoctor','Dr. '+item.Doutor+' - '+item.Especialidade,item.CRM, getClinics))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de clinicas/consultorios onde o médico atende via GET
  --------------------------------------------------------------------------------------
*/
const getClinics = async () => {
  var newDoctorSelection = document.getElementById("newDoctor");
  var newClinicSelection = document.getElementById("newClinic");
  removeOptions(newClinicSelection);
  var value = newDoctorSelection.value;
  let url = 'http://127.0.0.1:5000/consultorios?doctor_crm='+value;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.consultorios.forEach(item => insertOptions("newClinic",item,item,findSchedules))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
     selectElement.remove(i);
  }
}

const findSchedules = () => {
  newDoctorSelection = document.getElementById("newDoctor");
  newClinicSelection = document.getElementById("newClinic");
  doctor = newDoctorSelection.value;
  clinica = newClinicSelection.value;
  let url = 'http://127.0.0.1:5000/encontrar_agendamentos?doctor_crm='+doctor+'&clinic='+clinica;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.agendamentos.forEach(item => {
        findCalendarElement(item.Dia,item.Horario).setAttribute("id","unavailable");
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
   postItem(inputDoctor,inputPatient,inputHealthcare,inputClinic,inputContact,inputSchedule)
*/
const postItem = async (inputDoctor,inputClinic, inputCPF, inputPatient, inputHealthcare, inputContact, inputScheduleDate,inputScheduleTime) => {
  const formData = new FormData();
  formData.append('doctor_crm', inputDoctor);
  formData.append('clinic', inputClinic);
  formData.append('cpf',inputCPF);
  formData.append('patient', inputPatient);
  formData.append('healthcare', inputHealthcare);
  formData.append('contact', inputContact)
  formData.append('schedule_date', inputScheduleDate);
  formData.append('schedule_time', inputScheduleTime);
  formData.append('schedule_status', 'Occupied')
  let url = 'http://127.0.0.1:5000/agendamento';
  request = fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
      console.error(formData)
    });
  return request.response;
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const scheduleDate = div.getElementsByTagName('td')[2].innerHTML
      let scheduleTime= div.getElementsByTagName('td')[3].innerHTML
      scheduleTime.replace(":","-")
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(scheduleDate +"-"+ scheduleTime)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = () => {

  clinicToDelete = document.getElementById('newClinic').value;
  scheduleDateToDelete = document.getElementById('newScheduleDate').value;
  scheduleTimeToDelete = document.getElementById('newScheduleTime').value;
  cpfToDelete = document.getElementById('newCPF').value;

  if (cpfToDelete === ''){
    alert("Por favor, informe seu CPF para deletarmos o agendamento")
    return;
  }
  
  if (clinicToDelete === '' | scheduleDateToDelete === '' | scheduleTimeToDelete === ''){
    alert("Por favor, selecione a clinica e o horário para prosserguimos com a exclusão")
  }
  let url = 'http://127.0.0.1:5000/agendamento?clinic='+clinicToDelete+'&date='+scheduleDateToDelete+'&time='+scheduleTimeToDelete+'&cpf='+cpfToDelete;
  alert(clinicToDelete)
  alert(scheduleDateToDelete)
  alert(scheduleTimeToDelete)
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputDoctor = document.getElementById("newDoctor").value;
  let inputClinic = document.getElementById("newClinic").value;

  let inputCPF = document.getElementById("newCPF").value;
  let inputPatient = document.getElementById("newPatient").value;
  let inputHealthcare = document.getElementById("newHealthcare").value;
  let inputContact = document.getElementById("newContact").value;

  let inputScheduleDate = document.getElementById("newScheduleDate").value;
  let inputScheduleTime = document.getElementById("newScheduleTime").value;

  if (inputScheduleDate === '') {
    alert("Escolha um horário!");
  } else if (inputDoctor === '') {
    alert("Nome do doutor precisam ser definidos");
  }
  else if (inputPatient === ''|| inputCPF === ''){
    alert("Nome do paciente e cpf precisam ser definidoos");
  } else {
    postItem(inputDoctor,inputClinic,inputCPF,inputPatient,inputHealthcare,inputContact,inputScheduleDate,inputScheduleTime)
    /*insertList(inputDoctor,inputPatient,inputHealthcare,inputClinic,inputContact,inputScheduleDate,inputScheduleTime)*/
    limpaAgendamento();
  }
}
/*
  --------------------------------------------------------------------------------------
  Função para limpar items do formulário de agendamento
  --------------------------------------------------------------------------------------
*/

const limpaAgendamento = () => {
  document.getElementById("newCPF").value = "";
  document.getElementById("newPatient").value = "";
  document.getElementById("newHealthcare").value = "";
  document.getElementById("newContact").value = "";
  document.getElementById("newScheduleDate").value = "";
  document.getElementById("newScheduleTime").value = "";
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
/*inputDoctor,inputPatient,inputHealthcare,inputClinic,inputContact,inputSchedule*/
const insertList = (doctor,patient,healthcare,clinic,contact,schedule_date,schedule_time) => {
  var item = [doctor,patient,schedule_date,schedule_time,healthcare,clinic,contact]
  var table = document.getElementById('myTable');
  var row = table.insertRow();


  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newDoctor").value = "";
  document.getElementById("newPatient").value = "";
  document.getElementById("newHealthcare").value = "";
  document.getElementById("newClinic").value = "";
  document.getElementById("newContact").value = "";
  document.getElementById("newScheduleDate").value = "";
  document.getElementById("newScheduleTime").value = "";

  removeElement()
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
/*inputDoctor,inputPatient,inputHealthcare,inputClinic,inputContact,inputSchedule*/

const insertOptions = (selectionID,text,value,onClickFunction) => {/*doctor,speciality,crm */
  var optionSelection = document.getElementById(selectionID);
  var newOption = document.createElement('option');
  newOption.text = text;
  newOption.value = value;
  newOption.onclick = onClickFunction;
  optionSelection.add(newOption);
}

/*
  --------------------------------------------------------------------------------------
  Função para criação dinâmica do calendário
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
  for (var weekday = d.getDay(); weekday<d.getDay()+7;weekday++){

    str_month = ("0" + (d.getMonth()+1)).slice(-2)
    str_day =  d.getDate() + i
  
    task_date =str_day+"/"+str_month+"/"+d.getFullYear()
    generateCalendarElements(calendar,weekday,task_date,appointmentsPerDay,startHour,finalHour,appointmentTimeInMinutes);
    i = i + 1
  }
  
}

const generateCalendarElements = (calendar,weekday,task_date,appointmentsPerDay,startingHour,finishingHour,appointmentDuration) => {
  days = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  var newDiv = document.createElement("div");
  calendar.appendChild(newDiv);
  newDiv.classList.add("part_day");


  var newSpan = document.createElement("span");
  newSpan.classList.add("day");
  newSpan.textContent = days[weekday%7];
  newDiv.appendChild(newSpan);

  for (var i = 0; i < appointmentsPerDay; i++) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.setAttribute("task_date",task_date);
    scheduleInterval = (startingHour *60 + i * appointmentDuration) 
    formatedTimeString = ("0"+Math.floor(scheduleInterval/60)).slice(-2) + ":" + (scheduleInterval % 60).toLocaleString("en-US",{minimumIntegerDigits:2})
    taskDiv.setAttribute("task_time",formatedTimeString);
    newDiv.appendChild(taskDiv);
    var timeSpan = document.createElement("span");
    timeSpan.classList.add("time")
    timeSpan.textContent = formatedTimeString;
    taskDiv.appendChild(timeSpan);
    taskDiv.onclick = function(e){
      element = e.target;
      clicked_time = element.getAttribute("task_time");
      clicked_date = element.getAttribute("task_date");
      console.log(clicked_date);
      console.log(clicked_time);

      element.setAttribute("id","scheduling");
      showScheduleForm(clicked_time,clicked_date);
    }
    removeBtn = addRemoveButton(taskDiv,deleteItem);
    removeBtn.setAttribute('task_time',taskDiv.getAttribute("task_time"));
    removeBtn.setAttribute('task_date',taskDiv.getAttribute("task_date"));
  }
}

const addRemoveButton = (element,onClickFunction) =>{
  removeBtn = document.createElement('button')
  removeBtn.setAttribute('class', 'delete-btn')
  removeBtn.setAttribute('id', 'delete-btn')
  removeBtn.onclick = function(e){
    deleteItem();
    e.stopPropagation();
  }
  element.appendChild(removeBtn)
  return removeBtn;
}

const findCalendarElement = (schedule_date,schedule_time) =>{
  schedule_time = schedule_time.slice(0,-3);
  schedule_date = new Date(schedule_date)
  schedule_date = schedule_date.toLocaleString().split(",")[0]
  console.log(schedule_date)
  console.log(schedule_time)
  founded = document.querySelector('[task_date="'+schedule_date+'"][task_time="'+schedule_time+'"]');
  console.log(founded);
  return founded
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

const showScheduleForm = (task_time,task_date) => {
  let form = document.getElementsByClassName("confirmSchedule")[0];
  /*form.style.visibility = 'visible';*/
  document.getElementById("newPatient").focus();
  
  document.schedulerForm.newScheduleDate.value = task_date;
  document.schedulerForm.newScheduleTime.value = task_time;
  console.log(document.getElementById("newDoctor").value);

}

generateCalendar();
getDoctors();

