/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertOptions = (selectionID,text,value,onClickFunction) => {/*doctor,speciality,crm */
  var optionSelection = document.getElementById(selectionID);
  newOption = generateElement('option',optionSelection,{});
  newOption.text = text;
  newOption.value = value;
  newOption.onclick = onClickFunction;
  optionSelection.add(newOption);
}
