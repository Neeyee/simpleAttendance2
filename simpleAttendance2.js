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

       let delEmpResponse = confirm('Are you sure to delete employee?');
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
              // console.log($(this).val())
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
            //input another if statement to check if employees
            //have been added already, but get meetingData.name and store it, 
            //loop to check.
        } else {
            $.post('http://localhost:3000/meetingData', meetingData, alert('Meeting attendees have been added'));
        }
    });

    //get meeting subject and employee names from meeting data with checkbox in li
    $.get("http://localhost:3000/meetingData", function(meeting){
        $.each(meeting, function(i){
 
            $('#takeAttendance').append(`<form id="submitAttendance" >
            <h4>${meeting[i].name}</h4>
            <ol id="attendanceList">
            ${JSON.parse(meeting[i].attendees).map(function(meetingAttendees){
                return `<li class="markAttendance"><input type="checkbox" class="attendanceCheckbox">${meetingAttendees}</li>`
            }).join('')}
            </ol>
            <button data-id="${meeting[i].id}" class="saveAttendance" >sumbit</button>
            </form>`)
            
        });
    });

    //save attendance data
    $('#takeAttendance').on('click', '.saveAttendance', function(e) {
        e.preventDefault();

        let currentForm = $(this).closest('form');       
        let meetingSubject = currentForm.find('h4').text();
        let attendees = JSON.stringify($(currentForm.find('li')).map(function (i, li) {
            return $(li).text()
           //console.log({attendee: $(li).text()});
        }).get())

        let status = JSON.stringify($(currentForm.find('.attendanceCheckbox')).map(function () {
            return (this.checked) ? 'Present' : 'Absent'
          //  console.log(this.checked);
        }).get())
            // console.log({name: attendanceReport.attendee, status: attendanceReport.status});
         //console.log(attendanceReport);

        const attendanceData = {
            subject: meetingSubject,
            meetingAttendees: attendees,
            attendanceStatus: status
         }
         //console.log(attendanceData);
         $.post('http://localhost:3000/attendanceData', attendanceData, alert(`Attendance for meeting: ${meetingSubject}  has been recorded`))
     
    })

    //get attendnce data to div
    $.get('http://localhost:3000/attendanceData', function(attendance) {
        $.each(attendance, function(i){
            $('#viewAttendance').append(`<div>
                <h4>${attendance[i].subject}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Attendance status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ol>
                                    ${JSON.parse(attendance[i].meetingAttendees).map(function (employee) {
                                        return `<li>${employee}</li>`
                                    }).join('')}
                                </ol>
                            </td>
                            <td>
                                <ol>
                                    ${JSON.parse(attendance[i].attendanceStatus).map(function (status) {
                                        return `<li>${status}</li>`
                                    }).join('')}
                                </ol> 
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>`)
        });
    });
     
});