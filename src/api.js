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
};


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de doutores existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
var getDoctors = async function() {
  let url = 'http://127.0.0.1:5000/doutores';
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
    .then((response) => response.json())
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
  let url = 'http://127.0.0.1:5000/consultorios?doctor_crm='+value;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.clinics.forEach(item => insertOptions("newClinic",item.Nome,item.id,findSchedules))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
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
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}
