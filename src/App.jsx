import { useState } from 'react';
import Form from './components/Form/Form';
import ContactList from 'components/ContactList/ContactList';
import Filter from './components/Filter/Filter';
import warningMessage from './utils/warningMessage';
import useLocalStorage from 'hooks/useLocalStorage';

import shortid from 'shortid';

import css from './App.module.css';

export default function App() {
  const [contacts, setContacts] = useLocalStorage('contacts', []);
  const [filter, setFilter] = useState('');

  //----- Replaced with custom hook useLocalStorage -----
  // const [contacts, setContacts] = useState(() => {
  //   const contacts = JSON.parse(localStorage.getItem('contacts'));
  //   return contacts ? contacts : [];
  // });

  // useEffect(() => {
  //   localStorage.setItem('contacts', JSON.stringify(contacts));
  // }, [contacts]);

  const isDublicate = name => {
    const normalizedNewContactName = name.toLocaleLowerCase();

    const result = contacts.find(({ name }) => {
      return name.toLocaleLowerCase() === normalizedNewContactName;
    });

    return Boolean(result);
  };

  const addContact = ({ name, number }) => {
    if (isDublicate(name)) {
      warningMessage(name);
      return;
    }

    setContacts(prevContacts => {
      const newContact = {
        id: shortid.generate(),
        name: name,
        number: number,
      };
      return [newContact, ...prevContacts];
    });
  };

  const cangeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const normalizedFilter = filter.toLocaleLowerCase();
  const filteredContactList = contacts.filter(contact =>
    contact.name.toLocaleLowerCase().includes(normalizedFilter)
  );

  const deleteContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  return (
    <div className={css.phonebook}>
      <h1 className={css.phonebook__title}> Phonebook</h1>
      <Form onSubmit={addContact} />

      <h2 className={css.phonebook__subtitle}>Contacts</h2>
      <Filter value={filter} onChange={cangeFilter} />
      <ContactList
        contacts={filteredContactList}
        onDeleteContact={deleteContact}
      />
    </div>
  );
}
