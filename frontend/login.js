const login = document.querySelector(".login");
const register = document.querySelector(".register");
const logout = document.querySelector(".logout");
const loggedUser = document.querySelector(".logged-user");

login.addEventListener('click',userLogin);
logout.addEventListener('click',userLogout);


function showHideIcon(icon, flag){
    flag?(icon.style.display='none'):(icon.style.display="block");
}

function userLogin(e){ // cala funkcja do tworzenia wyskakujacego okienka z logowaniem
    e.preventDefault();
    const formDiv=document.createElement('div');
    formDiv.className='formDiv';
    const h2 = document.createElement('h2');
    h2.textContent='Login Form';
    formDiv.appendChild(h2);
    const loginForm = document.createElement('form');
    loginForm.className='login-form';
    const userName = document.createElement('input');
    userName.type='text';
    userName.name='username';
    userName.placeholder='user name';
    
    const password= document.createElement('input');
    password.type='password';
    password.name='password';
    password.placeholder='password';
    
    const submit = document.createElement("input");
    submit.type="submit";
    submit.name="Login";
    submit.addEventListener('click',userLoginRequest);
    loginForm.appendChild(userName);
    loginForm.appendChild(password);
    loginForm.appendChild(submit);
    formDiv.appendChild(loginForm);
    displayOverlay(formDiv);
}

function userLoginRequest(e){
    e.preventDefault();
    const form = document.querySelector('.login-form');
    const formData= new FormData(form); 
    fetchCall('login.php',userLoginResponse,'POST',formData);//pobiera dane z bazy
    function userLoginResponse(data){
        displayLoggedUser(data.user);
    }
}


function displayOverlay(modal){ // tlo ktore sie pojawia jak wlaczamy jakies wyskakujace okienko
        const main = document.querySelector('main');
        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.style.cssText = 
        "position:fixed;top: 0;left: 0;right: 0;width: 100vw;height: 100vh;background-color: #002;opacity: 0.8;z-index:200;";
        overlay.addEventListener('click',removeOverlay);
        main.appendChild(overlay);
        const modalContainer=document.createElement("div");
        modalContainer.className="modal-container";
        modalContainer.style.cssText = 
        "position: fixed;top: 25%;left: 25%;width: 50vw;height: 50vh;background-color: #fff;z-index:200;border-radius:7px;";
        modalContainer.appendChild(modal);
        main.appendChild(modalContainer);
}

function displayLoggedUser(user){ // pokazuje i chowa ikonki, wyswietla nazwe usera 
    removeOverlay();
    const loggedUserSpan = document.querySelector('.username');
    loggedUserSpan.textContent=user;
    showHideIcon(login,true);
    showHideIcon(register,true);
    showHideIcon(logout,false);
    showHideIcon(loggedUser,false);
}

function userLogout(){
    fetchCall('login.php',responseLogout);
function responseLogout(data){
    console.log(data);
    data.logout && displayLoginRegisterIcons();
}

}