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
       
       $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3000/employeeList/' + $(this).attr("data-id"), 
       });
       
    });
});