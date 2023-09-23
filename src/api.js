
var removeOptions = (selectElement) => {
  var i, L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
     selectElement.remove(i);
  }
};
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de agendamentos existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
var getList =  async function() {
  let url = 'http://127.0.0.1:5000/agendamentos';
  element = document.getElementById("myTable")
  if (element !== null){
    clearTable();
  }
  request = fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.agendamentos.forEach(item => insertList(
        item.Doutor, item.Dia, item.Horario,item.Consultorio_id,
        item.Consultorio,item.Status,item.CPF, item.Conttato, item.Paciente,item.Plano))

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  return request.response;
};


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de doutores existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
var getDoctors = async function() {
  let url = 'http://127.0.0.1:5000/doutores';
  request = fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.doutores.forEach(item => insertOptions('newDoctor','Dr. '+item.Doutor+' - '+item.Especialidade,item.CRM, getClinics))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  return request.response;
};

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
   postItem(inputDoctor,inputPatient,inputHealthcare,inputClinic,inputContact,inputSchedule)
*/
var postItem = function(inputDoctor,inputClinic,inputClinicID, inputCPF, inputPatient, inputHealthcare, inputContact, inputScheduleDate,inputScheduleTime) {
  const formData = new FormData();
  formData.append('doctor_crm', inputDoctor);
  formData.append('clinic', inputClinic);
  formData.append('clinic_id', inputClinicID);
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
    .then((response) => {
      if (response.status == '200'){
        e = document.getElementById('scheduling');
        e.removeAttribute("scheduling");
        e.setAttribute("id","unavailable")
      }  
      
      response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
      console.error(formData)
    });
  return request.response;
};


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de clinicas/consultorios onde o médico atende via GET
  --------------------------------------------------------------------------------------
*/
var getClinics = async function() {
  var newDoctorSelection = document.getElementById("newDoctor");
  var newClinicSelection = document.getElementById("newClinic");
  removeOptions(newClinicSelection);
  var value = newDoctorSelection.value;

  formData = new FormData()
  formData.append("crm",value)
  
  let url = 'http://127.0.0.1:5000/encontrar_consultorio';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      elementsMarked = document.getElementById("unavailable")
      if (elementsMarked !== null){
        document.querySelectorAll('[id^="unavailable"]').forEach(item => item.removeAttribute("id"))
      }
      data.clinics.forEach(item => insertOptions("newClinic",item.Nome,item.id,findSchedules))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  return request.response;
};



/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de agendamentos para um médico no consultório via GET
  --------------------------------------------------------------------------------------
*/
const findSchedules = () => {
  newDoctorSelection = document.getElementById("newDoctor");
  newClinicSelection = document.getElementById("newClinic");
  doctor = newDoctorSelection.value;
  clinic = newClinicSelection.value;
  formData = new FormData()
  formData.append("doctor_crm",doctor)
  formData.append("clinic_id",clinic)
  let url = 'http://127.0.0.1:5000/encontrar_agendamentos';
  request = fetch(url, {
    method: 'post',
    body: formData
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
  return request.response;
}


/*
  --------------------------------------------------------------------------------------
  Função para obter um agendamento via POST
  --------------------------------------------------------------------------------------
*/
const findSchedule = () => {
  clinicSelection = document.getElementById("newClinic").value;
  scheduleDate = document.getElementById("newScheduleDate").value;
  scheduleTime = document.getElementById("newScheduleTime").value;


  formData = new FormData()
  formData.append("clinic",clinicSelection)
  formData.append("schedule_date",scheduleDate)
  formData.append("schedule_time",scheduleTime)
  let url = 'http://127.0.0.1:5000/encontrar_agendamento';
  console.log(url)

  request = fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => { fillInfoCard(data); }
    )
    .catch((error) => {
      console.error('Error:', error);
    });
  return request.response;
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


  formData = new FormData()
  formData.append("clinic_id",clinicToDelete)
  formData.append("schedule_date",scheduleDateToDelete)
  formData.append("schedule_time",scheduleTimeToDelete)
  formData.append("cpf",cpfToDelete)
  if (cpfToDelete === ''){
    alert("Por favor, informe seu CPF para deletarmos o agendamento")
    return;
  }
  
  if (clinicToDelete === '' | scheduleDateToDelete === '' | scheduleTimeToDelete === ''){
    alert("Por favor, selecione a clinica e o horário para prosserguimos com a exclusão")
  }
  let url = 'http://127.0.0.1:5000/agendamento';
  request = fetch(url, {
    method: 'delete',
    body: formData
  })
    .then((response) => {
      if(response.status == "200"){
        findCalendarElement(scheduleDateToDelete,scheduleTimeToDelete).removeAttribute("id")
      }
      response.json()
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  return request.response;
}