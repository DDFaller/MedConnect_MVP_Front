let tableHtml = ` 
<div class='table-overlay'> \
            <div class='update-table' onclick='getList()'>Atualizar</div>     \
            <table id='myTable'>      \
                <tr>      \
                    <th>CRM</th>      \
                    <th>Clinica</th>      \
                    <th>Id Clinica</th>     \
                    <th>Dia</th>      \
                    <th>Horário</th>      \
                    <th>CPF</th>      \
                    <th>Nome paciente</th>      \
                    <th>Contato</th>      \
                    <th>Plano</th>      \
                    <th>Status</th>     \
                </tr>\
            </table>      \
        </div>      \
        ` 

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (doctor_crm,schedule_date,schedule_time,clinic_id,clinic,
                    status,cpf,contact,patient,healthcare) => {
    
  var item = [doctor_crm,clinic,clinic_id,schedule_date,schedule_time,cpf,patient,contact,healthcare,status]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
}


const clearTable = () => {
  var table = document.getElementById('myTable');
  for(var i = table.rows.length - 1; i > 0; i--)
  {
      table.deleteRow(i);
  }

}
/*
  --------------------------------------------------------------------------------------
  Função para expandir a tabela
  --------------------------------------------------------------------------------------
*/
const expandTable = () => {
  element = document.getElementsByClassName("table-schedules");
  popUp = createPopUp(element,()=>{})
  popUp.innerHTML += tableHtml;
  overlayIn();
}

