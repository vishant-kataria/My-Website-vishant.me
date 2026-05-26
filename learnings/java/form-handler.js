// form-handler.js

const NEON_URL = "https://ep-twilight-silence-aoldtn59-pooler.c-2.ap-southeast-1.aws.neon.tech/sql";
const NEON_CONN = "postgresql://neondb_owner:npg_Efu38ChnpPbm@ep-twilight-silence-aoldtn59-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Stop page reload
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        
        const firstName = (formData.get('FirstName') || '').replace(/'/g, "''");
        const lastName = (formData.get('lastName') || '').replace(/'/g, "''");
        const phoneNumber = (formData.get('Phone Number') || '').replace(/'/g, "''");
        const favoriteDecade = parseInt(formData.get('Favorite Decade')) || 0;
        const country = (formData.get('country') || '').replace(/'/g, "''");
        const food = (formData.get('food') || '').replace(/'/g, "''");
        const message = (formData.get('message') || '').replace(/'/g, "''");
        
        // Handle multiple checkboxes for pets
        const pets = formData.getAll('pets');
        const petsJson = JSON.stringify(pets).replace(/'/g, "''");

        const query = `
          INSERT INTO contact_messages 
          (first_name, last_name, phone_number, favorite_decade, country, food, pets, message) 
          VALUES 
          ('${firstName}', '${lastName}', '${phoneNumber}', ${favoriteDecade}, '${country}', '${food}', '${petsJson}', '${message}')
        `;

        const res = await fetch(NEON_URL, {
          method: 'POST',
          headers: { 'Neon-Connection-String': NEON_CONN },
          body: JSON.stringify({ query })
        });
        
        if (res.ok) {
          alert('Message sent successfully!');
          form.reset();
        } else {
          alert('Error sending message. Please try again.');
        }

      } catch(err) {
        console.error(err);
        alert('Error sending message. Please check connection.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
