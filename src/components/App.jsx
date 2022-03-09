import React, { useState, useEffect } from 'react';
import { getContacts, postContact, deleteContact, updateContact } from '../services/contact';
import Swal from 'sweetalert2';
import Table from './Table'

const App = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        getContacts().then((response) => {
            setContacts(response);
        })
    }, []);

    const postContacts = () => {
        Swal.fire({
            title: 'Submit the data you want to create',
            html: '<form><input type="text" id="Name" class="swal2-input" placeholder="Name" maxlength="40"><input type="text" id="lastname" class="swal2-input" placeholder="LastName" maxlength="40"><input type="email" id="email" class="swal2-input" placeholder="Email" maxlength="40"><input type="number" id="phone" class="swal2-input" placeholder="Phone Number" maxlength="40"></form>',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Create',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#Name').value;
                const lastname = Swal.getPopup().querySelector('#lastname').value;
                const email = Swal.getPopup().querySelector('#email').value;
                const phone = Swal.getPopup().querySelector('#phone').value;
                if (isNaN(parseInt(phone))) {
                    return Swal.showValidationMessage(
                        `Request failed: Phone must be a number`
                    )
                }
                if (name === "" || lastname === "" || email === "" || phone === "") {
                    return Swal.showValidationMessage(
                        `Request failed: All values are needed`
                    )
                }
                return postContact(name, lastname, email, phone)
                    .then(response => {
                        getContacts().then((response) => {
                            setContacts(response);
                        })
                        return response;
                    })
                    .catch(error => {
                        console.log(error);
                        Swal.showValidationMessage(
                            `Request failed: Repeated Email `
                        )
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `Contact created properly with email ${result.value.email}`
                })
            }
        })
    }
    return (
        <React.Fragment>
            <h1>Contacts!</h1>
            <Table data={contacts}></Table>
            <button type="button" className="btn btn-primary" onClick={postContacts}>Create New</button>
        </React.Fragment>
    )
}

export default App;