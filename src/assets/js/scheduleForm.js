const showScheduleForm = (task_time,task_date) => {
  let form = document.getElementsByClassName("confirmSchedule")[0];
  /*form.style.visibility = 'visible';*/
  document.getElementById("newPatient").focus();
  
  document.schedulerForm.newScheduleDate.value = task_date;
  document.schedulerForm.newScheduleTime.value = task_time;
  console.log(document.getElementById("newDoctor").value);

}