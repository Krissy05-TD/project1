import React, { useState, useEffect } from 'react';
import { account, client } from '../appwrite-config';
import { Databases, ID } from 'appwrite'; 
  
const databases = new Databases(client);
const databaseId = '6803ec16001c90f3cfa0';
const collectionId = '6804aea7002cd1855fc0';

function Profile() {
  const [firstName, setFirstName] = useState(''); // State for first name
  const [lastName, setLastName] = useState('');   // State for last name
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [error, setError] = useState('');         // State for error messages
  const [success, setSuccess] = useState('');       // State for success messages
  const [userId, setUserId] = useState(null);       // State to store user ID

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the current user's data
        const user = await account.get();
        setUserId(user.$id);

         // List documents in the collection matching the current user's ID
        const { equal } = Databases.queries;
        let documents = await databases.listDocuments(
          databaseId,
          collectionId,
          [ equal('userId', user.$id) ]
        );

        // If a document for the user exists, set the state with the data from the document
        if (documents.documents.length > 0) {
          const profileData = documents.documents[0].data;
          setFirstName(profileData.firstName || '');
          setLastName(profileData.lastName || '');
          setPhoneNumber(profileData.phoneNumber || '');
        } else {
          // Create a new document if it doesn't exist
          await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            { userId: user.$id }
          );
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
       // List documents in the collection matching the current user's ID
      const { equal } = Databases.queries;
      let documents = await databases.listDocuments(
        databaseId,
        collectionId,
        [ equal('userId', userId) ]
      );

      if (documents.documents.length > 0) {
        const documentId = documents.documents[0].$id;
        // Update the document with the new profile data
        await databases.updateDocument(
          databaseId,
          collectionId,
          documentId,
          {
            firstName,
            lastName,
            phoneNumber,
          }
        );
        setSuccess('Profile updated successfully!');
      } else {
        setError('No profile found. Please try again.');
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="First Name Placeholder text"
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
        /><br /> 
        <input
          type="text"
          placeholder="Last Name Placeholder text"
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
        /><br /> 
        <input
          type="tel"
          placeholder="Phone Number Placeholder text"
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
        /><br /> 
        <button type="submit">Save Changes</button> 
      </form>
      {error && <p style={{ color: 'red' }}>{error /*Error message*/ }</p>} 
      {success && <p style={{ color: 'green' }}>{success /*Success message*/ }</p>} 
    </div>
  );
}

export default Profile;