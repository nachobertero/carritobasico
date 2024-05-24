// Variables
const cart = document.querySelector('#carrito'); // Obtengo el elemento del carrito
const courseList = document.querySelector('#lista-cursos'); // Obtengo la lista de cursos
const cartContainer = document.querySelector('#lista-carrito tbody'); // Obtengo el contenedor del carrito
const emptyCartBtn = document.querySelector('#vaciar-carrito'); // Obtengo el botón para vaciar el carrito
let cartItems = []; // Inicializo un array vacío para almacenar los cursos seleccionados

// Listeners
loadEventListeners();

function loadEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     courseList.addEventListener('click', addCourse);

     // Cuando se elimina un curso del carrito
     cart.addEventListener('click', removeCourse);

     // Cargar LocalStorage
     document.addEventListener('DOMContentLoaded', () => {
         cartItems = JSON.parse(localStorage.getItem('cart')) || []; 
         showCartItems();
     });

     // Al Vaciar el carrito
     emptyCartBtn.addEventListener('click', emptyCart);
}

// Funciones
// Función que añade el curso al carrito
function addCourse(e) {
     e.preventDefault();
     // Delegación para agregar-carrito
     if(e.target.classList.contains('agregar-carrito')) {
          const course = e.target.parentElement.parentElement;
          // Enviamos el curso seleccionado para tomar sus datos
          readCourseData(course);
     }
}

// Lee los datos del curso
function readCourseData(course) {
     const courseInfo = {
          image: course.querySelector('img').src,
          title: course.querySelector('h4').textContent,
          price: course.querySelector('.precio span').textContent,
          id: course.querySelector('a').getAttribute('data-id'), 
          quantity: 1
     }

     // Verifica si el curso ya está en el carrito
     if(cartItems.some(course => course.id === courseInfo.id)) { 
          // Si existe, aumenta la cantidad
          const courses = cartItems.map(course => {
               if(course.id === courseInfo.id) {
                    course.quantity++;
               }
               return course;
          });
          cartItems = [...courses];
     } else {
          // Si no existe, agrega el curso al carrito
          cartItems = [...cartItems, courseInfo];
     }

     // Muestra los cursos en el carrito
     showCartItems();
}

// Elimina el curso del carrito en el DOM
function removeCourse(e) {
     e.preventDefault();
     if(e.target.classList.contains('borrar-curso')) {
          // Obtiene el ID del curso a eliminar
          const courseId = e.target.getAttribute('data-id');
          // Filtra el carrito para eliminar el curso
          cartItems = cartItems.filter(course => course.id !== courseId);
          // Muestra los cursos actualizados en el carrito
          showCartItems();
     }
}

// Muestra los cursos seleccionados en el carrito
function showCartItems() {
     // Vacía el carrito antes de mostrar los cursos
     clearCart();

     // Agrega cada curso al carrito en el HTML
     cartItems.forEach(course => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td>  
                    <img src="${course.image}" width=100>
               </td>
               <td>${course.title}</td>
               <td>${course.price}</td>
               <td>${course.quantity}</td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${course.id}">X</a>
               </td>
          `;
          cartContainer.appendChild(row);
     });

     // LocalStorage
     updateLocalStorage();
}

// Actualiza el localStorage con el contenido del carrito
function updateLocalStorage() {
     localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Elimina todos los cursos del carrito en el DOM y del array
function clearCart() {
     // Elimina todos los elementos hijos del contenedor del carrito
     while(cartContainer.firstChild) {
          cartContainer.removeChild(cartContainer.firstChild);
     }
}

// Vacía el carrito completamente
function emptyCart() {
     cartItems = []; // Reinicia el array de cursos
     clearCart(); // Limpia el HTML
     updateLocalStorage(); // Actualiza el localStorage
}
