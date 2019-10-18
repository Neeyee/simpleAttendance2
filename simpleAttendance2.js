$(function () {
    //create employee
    $('#createEmployee').click(function (e) {
        e.preventDefault();

        const employeeFullName = $('#fullName').val();
        const employeeGender = $("input[name='gender']:checked").val();
        const employeeEmail = $('#email').val();
        const employeePhoneNumber = $('#phoneNumber').val();

        const employeeInfo = {
            name: employeeFullName,
            gender: employeeGender,
            email: employeeEmail,
            phoneNumber: employeePhoneNumber
        }

        if (employeeFullName === '' || employeeGender == undefined || employeeEmail === '' || employeePhoneNumber === '') {
            alert('Please input all the fields')
        } else {
            $.post('http://localhost:3000/employeeList', employeeInfo, alert('Employee has been added'))
        }
        
    });

    //read all employee
    $.get("http://localhost:3000/employeeList", function(employeeInfo){
        $.each(employeeInfo, function(i){
            $('#employeeList').append(`<li>${employeeInfo[i].name} ${employeeInfo[i].gender} ${employeeInfo[i].email} ${employeeInfo[i].phoneNumber} <button data-id='${employeeInfo[i].id}' class='removeEmployee'>Delete</button></li>`)
        });
    });

    //delete an employee
    $('#employeeList').on('click', '.removeEmployee', function (e) {
       e.preventDefault();

       let delEmpResponse = confirm('Are you sure you want to delete employee?');
       if (delEmpResponse) {
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3000/employeeList/' + $(this).attr("data-id"), 
        });
       };
    });

    //create a meeting
    $('#date').datepicker();

    $('#createMeeting').click(function (e) {
       e.preventDefault();
       
       const meetingDate = $('#date').val();
       const meetingSubject = $('#subject').val(); 

       const newMeeting = {
        date: meetingDate,
        subject: meetingSubject
       }

       if (meetingDate === '' || meetingSubject === '' ) {
        alert('Please fill both fields')
        } else {
            $.post('http://localhost:3000/meeting', newMeeting, alert('Meeting has been added'))
        }
    });

    //get employee  names to be added to meeting
    $.get("http://localhost:3000/employeeList", function(employeeInfo){
        $.each(employeeInfo, function(i){
            $('#meetingEmployee').append(`<li><input type="checkbox" value='${employeeInfo[i].name}'>${employeeInfo[i].name}</li>`)
        });
    });
    
    //get meeting from server 
    $.get("http://localhost:3000/meeting", function(selectMeeting){
        $.each(selectMeeting, function(i){
            $('#selectMeeting').append(`<option value="${selectMeeting[i].subject}">${selectMeeting[i].subject}</option>`)
        });
    });

    //add meeting attendees to server
    $('#addEmployee').click(function (e) {
       e.preventDefault();
       
       let meetingAttendeesArr = [];
       const selectedMeeting = $('#selectMeeting option:selected').val();
       $('#meetingEmployee input:checked').each(function () {
           meetingAttendeesArr.push($(this).val());
            //    console.log(meetingAttendees)
            //    console.log(selectedMeeting)
       });

       stringMeetingAttendeesArr = JSON.stringify(meetingAttendeesArr)
       //console.log(stringMeetingAttendeesArr);
       
       const meetingData = {
           name:selectedMeeting,
           attendees:stringMeetingAttendeesArr
       }
       //console.log(selectedMeeting)
        if (selectedMeeting === '' ){
            alert('Please select meeting')
        } else if(stringMeetingAttendeesArr == "[]" ) {
            alert('Please select employee(s) to be added to meeting')
        } else {
            $.post('http://localhost:3000/meetingData', meetingData, alert('Meeting attendees have been added'));
        }
    });
});