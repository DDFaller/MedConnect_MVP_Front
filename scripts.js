cpf = ""
password = ""

/*
  --------------------------------------------------------------------------------------
  UTILS: Função para criação dinamica de elementos no body
  --------------------------------------------------------------------------------------
  */

  const generateElement = (elementType,parent,attributesList) =>{
    var elementGenerated = document.createElement(elementType);
    parent.appendChild(elementGenerated);
    for(var key in attributesList) {
      elementGenerated.setAttribute(key,attributesList[key]);
    }
    return elementGenerated;
  }
/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo buscando o valores necessários para criação do form
  Parametrôs para um Schedule:
    - Doctor
    - Clinic
    - Clinic ID
    - CPF paciente
    - Nome paciente
    - Plano de saude
    - Contato
    - Dia da consulta
    - Horário da consulta
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputDoctor = document.getElementById("newDoctor").value;
  let inputClinic = document.getElementById("newClinic").textContent.replaceAll(/\s/g, '');
  let inputClinicID = document.getElementById("newClinic").value;

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
    postItem(inputDoctor,inputClinic,inputClinicID,inputCPF,inputPatient,inputHealthcare,inputContact,inputScheduleDate,inputScheduleTime)
    limpaAgendamento();
  }
}
/*
  --------------------------------------------------------------------------------------
  Função auxiliar para limpar items do formulário de agendamento
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




getDoctors();

