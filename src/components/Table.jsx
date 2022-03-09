import React, { useState, useEffect } from 'react';
import { getContacts, deleteContact, updateContact } from '../services/contact';
import Swal from 'sweetalert2';

const Table = ({data}) => {

    const [contacts, setContacts] = useState(data);

    useEffect(() => {
        getContacts().then((response) => {
            setContacts(response);
        })
    }, [data]);

    const deleteContactA = (email, index) => {
        deleteContact(email).then(response => {
            getContacts().then((response) => {
                setContacts(response);
            })
        });
    }

    const updateContactA = (name, lastname, email, phone) => {
        Swal.fire({
            title: 'Change the data you want to update',
            html: `<form><input type="text" id="Name" class="swal2-input" value="${name}" maxlength="40"><input type="text" id="lastname" class="swal2-input" value="${lastname}" maxlength="40"><input type="number" id="phone" class="swal2-input" value="${phone}" maxlength="40"></form>`,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Update',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const names = Swal.getPopup().querySelector('#Name').value;
                const lastnames = Swal.getPopup().querySelector('#lastname').value;
                const phones = Swal.getPopup().querySelector('#phone').value;
                if (isNaN(parseInt(phone))) {
                    return Swal.showValidationMessage(
                        `Request failed: Phone must be a number`
                    )
                }
                if (name === "" || lastname === "" || phone === "") {
                    return Swal.showValidationMessage(
                        `Request failed: All values are needed`
                    )
                }
                return updateContact(names, lastnames, email, phones)
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
                    title: `Contact updated properly`
                })
            }
        })
    }

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

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
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
                            <td> <button type="button" className="btn btn-success"
                                onClick={() => getHistory(item.cambios)}>Show Edits </button></td>
                            <td> <button type="button" className="btn btn-danger"
                                onClick={() => deleteContactA(item.email, index)}>Delete </button></td>
                            <td><button type="button" className="btn btn-warning" onClick={() => updateContactA(item.nombre, item.apellido, item.email, item.celular)}>Update</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Table;

