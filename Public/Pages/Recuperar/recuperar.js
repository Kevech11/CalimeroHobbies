// document.getElementById('send-code-button').addEventListener('click', function (e) {
//     e.preventDefault();
//     document.getElementById('verification-code-container').style.display = 'flex';
//     document.getElementById('verify-code-button').style.display = 'block';
//   });

//   document.getElementById('back-to-login').addEventListener('click', function () {
//     // Lógica para regresar al formulario de login
//     document.getElementById('password-recovery-container').classList.remove('toggle');
//   });

const form = document.getElementById("password-recovery")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = e.target.email.value

  const res = await fetch("http://localhost:5001/api/auth/recoverypassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  const response = await res.json()

  console.log(response)
})
