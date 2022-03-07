import React, { useState, useEffect } from 'react';
import { getContacts, postContact, deleteContact } from '../services/contact';
import Swal from 'sweetalert2';

const App = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        getContacts().then((response) => {
            setContacts(response);
        })
    }, []);

    const getHistory = (cambios) => {
        let template = ``;
        cambios.forEach(cambio => {
            console.log(cambio.fecha);
            template += `<p>${cambio.cambio} en ${new Date(cambio.fecha).toLocaleString()}</p>`;
        })

        Swal.fire({
            title: "Edits",
            html: template,
            confirmButtonText: 'Exit'
        })
    }

    const postContacts = () => {
        Swal.fire({
            title: 'Submit the data you want to create',
            html: '<form><input type="text" id="Name" class="swal2-input" placeholder="Name"><input type="text" id="lastname" class="swal2-input" placeholder="LastName"><input type="email" id="email" class="swal2-input" placeholder="Email"><input type="number" id="phone" class="swal2-input" placeholder="Phone Number"></form>',
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
                console.log(typeof phone, parseInt(phone));
                if (isNaN(parseInt(phone))) {
                    return Swal.showValidationMessage(
                        `Request failed: Phone must be a number`
                    )
                }
                return postContact(name, lastname, email, phone)
                    .then(response => {
                        console.log("res" + response);
                        setContacts(contacts.push({   
                            "nombre": name,
                            "apellido": lastname, 
                            "email": email,
                            "celular": phone
                        }))
                        return response
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
                // setContacts(contacts.push(result));
                Swal.fire({
                    title: `Contact created properly with email ${result.value.email}`
                })
            }
        })
    }

    const deleteContactA = (email, index) => {
        deleteContact(email).then(response => {
            contacts.splice(index, 1);
            setContacts(contacts);
        });
    }

    return (
        <React.Fragment>
            <h1>Contacts!</h1>
            <input></input>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Edits</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((item, index) => {
                        return (
                            <tr key={item.email}>
                                <td> {item.nombre} </td>
                                <td> {item.apellido} </td>
                                <td> {item.email} </td>
                                <td> {item.celular} </td>
                                <td> <button type="button" className="btn btn-primary"
                                    onClick={() => getHistory(item.cambios)}>Show Edits </button></td>
                                <td> <button type="button" className="btn btn-danger"
                                    onClick={() => deleteContactA(item.email, index)}>Delete </button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <button type="button" className="btn btn-primary" onClick={postContacts}>Create New</button>
        </React.Fragment>
    )
}

export default App;