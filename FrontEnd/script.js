const gallery = document.querySelector('.gallery');

const filters = document.querySelector(".filters");
const portfoliotitle = document.querySelector(".portfoliotitle");
const modal = document.querySelector('#modal1');
const token = sessionStorage.getItem("token");

async function main() {
    displayWorks();
    displayfilters();
    admin();
    //createModal();
    //closeModal();
}

main();

/***appel de l'API***/

/**works **/
async function getWorks() {
    try {
        const worksResponse = await fetch("http://localhost:5678/api/works");
        return worksResponse.json();
    }
    catch (error) {
        console.log("Erreur durant la récupération des projets dans l'API")
    }
}

/**category**/
async function getCategories() {

    try {
        const categoriesResponse = await fetch("http://localhost:5678/api/categories");
        return categoriesResponse.json();
    }
    catch (error) {
        console.log("Erreur durant la récupération des catégories dans l'API")
    }
}


/* fonction pour delete les works avec l'API */
async function deleteProject(projectId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            console.log("Projet supprimé avec succès");
            displayWorks();
            //debugger;
            displayWorksInModal();
        } else if (response.status === 401) {
            throw new Error("Action non autorisé");
        }
        else {
            throw new Error('Erreur lors de la suppression du projet');
        }
    } catch (error) {
        console.error(error.message);
    }
}

/***Affichage dynamique de la gallery***/
async function displayWorks(categorieId) {

    try {
        const dataworks = await getWorks();
        gallery.innerHTML = "";

        dataworks.forEach((work) => {
            if (categorieId == work.category.id || categorieId == null) {
                createWorks(work);
            }
        });
    }
    catch (error) {
        console.log("Erreur durant l'affichage des projets")
    }
}









/***Création des projets dans la gallery***/
function createWorks(works) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = works.imageUrl;
    figcaption.innerText = works.title;
    figure.setAttribute("categorieId", works.category.id);

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

function createFilter(category) {
    const btnCategorie = document.createElement("button");
    btnCategorie.innerText = category.name;
    btnCategorie.setAttribute("class", "btnfilter");
    btnCategorie.setAttribute("buttonID", category.id);
    filters.appendChild(btnCategorie);
}

async function displayfilters() {
    const dataCategories = await getCategories();


    dataCategories.forEach((category) => {

        createFilter(category)

    });

    const allButtons = document.querySelectorAll('.btnfilter');

    allButtons.forEach((btnCategorie) => {

        /**event listener pour les btn**/
        btnCategorie.addEventListener('click', function () {

            let categoryId = btnCategorie.getAttribute("buttonID");

            /**suppression de la classe 'selected'**/

            allButtons.forEach(button => button.classList.remove('selected'));

            /**Ajout de la classe 'selected' uniquement sur le btn sélectionné**/
            btnCategorie.classList.add('selected');

            /**Affichage des works suivant la catégorie**/
            displayWorks(categoryId);
        });

    });


}

/**Vérification de la connexion sur index.html**/
function admin() {
    const loginLink = document.getElementById("login");
    const logoutLink = document.getElementById("logout");


    if (token) {
        loginLink.style.display = "none";
        logoutLink.style.display = "block";

        /**Gestionnaire d'événement pour la déconnexion**/
        logoutLink.addEventListener("click", function () {
            sessionStorage.removeItem("token");
            window.location.href = "./index.html";
        });

        /*Création de la bannière*/
        const blackBanner = document.createElement('div');
        blackBanner.style.backgroundColor = 'black';
        blackBanner.style.width = '100%';
        blackBanner.style.height = '40px';
        blackBanner.style.display = 'flex';
        blackBanner.style.justifyContent = 'center';
        blackBanner.style.alignItems = 'center';
        blackBanner.style.color = 'white';

        /*Création du span pour l'icône et le texte*/
        const iconTextContainer = document.createElement('span');
        iconTextContainer.style.display = 'flex';
        iconTextContainer.style.alignItems = 'center';
        /*Création de l'icône crayon*/

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-pen-to-square');
        icon.style.marginRight = '10px';
        iconTextContainer.appendChild(icon);

        /*Création du texte*/
        const textNode = document.createTextNode('Mode édition');
        iconTextContainer.appendChild(textNode);

        /*Ajout du span à l'intérieur de la bannière*/
        blackBanner.appendChild(iconTextContainer);

        /*Ajout de la bannière noire à l'élément banner*/
        banner.appendChild(blackBanner);

        /*zone filtre cachée*/
        filters.style.display = 'none';



        /* selection du porfolio*/
        const portfolioTitle = document.querySelector('.portfoliotitle');

        /* création de la div pour l'icone et le texte */
        const modifiedButton = document.createElement('div');
        modifiedButton.classList.add('modified-button');

        /* clone l'icone déjà crée */
        const clonedIcon = icon.cloneNode(true);

        /* ajoute l'icone cloné à la div modifiedButton*/
        modifiedButton.appendChild(clonedIcon);

        /*création du texte modifié*/
        const buttonText = document.createTextNode('Modifié');

        /*ajoute le texte à la div modifiedButton*/
        modifiedButton.appendChild(buttonText);

        /* style pour le bouton modifié*/
        modifiedButton.style.display = 'flex';
        modifiedButton.style.alignItems = 'center';
        modifiedButton.style.cursor = 'pointer';
        modifiedButton.style.color = 'black';
        modifiedButton.style.fontSize = '15px';

        buttonText.parentNode.style.fontWeight = 'normal';


        /*event listener pour ouvrir la modale*/
        modifiedButton.addEventListener('click', openModal);

        /*ajout de la div modifiedButton à la div portofoliotitle*/
        portfolioTitle.appendChild(modifiedButton)
    } else {
        loginLink.style.display = "block";
        logoutLink.style.display = "none";
    }
};


/*Fonction pour ouvrir la fenêtre modale*/
function openModal() {
    const modal = document.querySelector('#modal1');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}
/* événement de clic pour le bouton "Modifié"*/
const modifiedButton = document.querySelector('.modified-button');
modifiedButton.addEventListener('click', openModal);

/*création du contenu de la fenêtre modale*/
//const modalWrapper = document.querySelector('.modal-wrapper');

/* ajout des images pour la gallery modale*/
function createWorkElement(work) {
    const figure = document.createElement("figure");
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    const deleteIcon = document.createElement("button");

    img.src = work.imageUrl;
    img.classList.add('modal-image');

    imgContainer.appendChild(img);
    imgContainer.classList.add('img-container');

    deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteIcon.classList.add('delete-button');
    deleteIcon.style.fontWeight = 'normal';

    deleteIcon.addEventListener('click', async () => {
        if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
            await deleteProject(work.id);

        }
    });

    imgContainer.appendChild(deleteIcon);
    figure.appendChild(imgContainer);
    return figure;
}

/***Affichage dynamique de la gallery***/
async function displayWorksInModal() {

    try {
        const dataworks = await getWorks();

        const galleryModal = document.querySelector('.works-modal');
        console.log(galleryModal);
        galleryModal.innerHTML = "";

        dataworks.forEach((work) => {

            const workElement = createWorkElement(work);
            galleryModal.appendChild(workElement);


        });
    }
    catch (error) {
        console.log("Erreur durant l'affichage des projets")
    }
}


/* Fonction pour afficher les works dans la fenêtre modale */
async function createModal() {

    try {
        const modalWrapper = document.querySelector('.modal-wrapper');



        const dataWorks = await getWorks();


        /* Création de l'élément pour la croix de fermeture */
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.classList.add('close-button');

        /* Création de la div pour le titre et la croix */
        const titleAndCloseDiv = document.createElement('div');
        titleAndCloseDiv.classList.add('modal-title');
        titleAndCloseDiv.appendChild(closeButton);

        modalWrapper.appendChild(titleAndCloseDiv);

        /* eventlistener pour fermer la fenêtre modale en cliquant sur la croix */
        closeButton.addEventListener('click', closeModal);

        /* eventlistener pour la touche Échap qui permet de fermer la fenêtre modale */
        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

        /* Ajout du titre "Galerie photo" à la nouvelle div */
        const galleryTitle = document.createElement('h3');
        galleryTitle.textContent = 'Galerie photo';
        galleryTitle.style.textAlign = 'center';

        titleAndCloseDiv.appendChild(galleryTitle);

        /* Création de la div pour les works */
        const worksDiv = document.createElement('div');
        worksDiv.classList.add('works-modal');

        dataWorks.forEach((work) => {
            const workElement = createWorkElement(work);
            worksDiv.appendChild(workElement);
        });

        modalWrapper.appendChild(worksDiv);

        /*création et ajout d'une div pour la linedivider */
        const lineDivider = document.createElement('div');
        lineDivider.classList.add('line-divider');
        modalWrapper.appendChild(lineDivider);

        /* Création de la div pour le bouton "Ajouter une photo" */
        const addPhotoButtonModal = document.createElement('div');
        addPhotoButtonModal.classList.add('add-photo-modal');

        const addPhotoButton = document.createElement('button');
        addPhotoButton.textContent = 'Ajouter une photo';
        addPhotoButton.classList.add('add-photo-button');
        addPhotoButton.style.backgroundColor = '#1D6154';
        addPhotoButton.style.color = 'white';
        addPhotoButton.style.padding = '10px';
        addPhotoButton.style.border = 'none';
        addPhotoButton.style.cursor = 'pointer';
        addPhotoButton.style.marginTop = '20px';
        addPhotoButton.style.borderRadius = '20px';
        addPhotoButton.style.width = '45%';

        addPhotoButtonModal.appendChild(addPhotoButton);
        modalWrapper.appendChild(addPhotoButtonModal);

        /*events listener pour le bouton Ajouter une photo*/
        addPhotoButton.addEventListener('click', function () {
            /*Masquer la galerie photo de la fenêtre modale*/
            titleAndCloseDiv.style.display = 'none';
            worksDiv.style.display = 'none';
            lineDivider.style.display = 'none';
            addPhotoButtonModal.style.display = 'none';

            /*Création du formulaire d'ajout de photo*/
            const photoForm = createPhotoForm();
            modalWrapper.appendChild(photoForm);
        });

        addPhotoButtonModal.appendChild(addPhotoButton);
        modalWrapper.appendChild(addPhotoButtonModal);


        /*Gestionnaire d'événements pour détecter les clics en dehors de la fenêtre */
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });




    } catch (error) {
        console.log("Erreur durant l'affichage des projets");
    }
}


/*Fonction pour créer le formulaire d'ajout de photo*/
function createPhotoForm() {
    const form = document.createElement('form');
    form.classList.add('photo-form');



    /* Div pour le titre, la croix, et la flèche */
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('header-div');

    const formTitle = document.createElement('h3');
    formTitle.textContent = 'Ajout photo';
    formTitle.style.textAlign = 'center';
    headerDiv.appendChild(formTitle);

    /* Création de la croix pour fermer */
    const closeFormButton = document.createElement('span');
    closeFormButton.innerHTML = '&times;';
    closeFormButton.classList.add('close-button');
    headerDiv.appendChild(closeFormButton);

    /* Event listener pour fermer la fenêtre modale en cliquant sur la croix du formulaire */
    closeFormButton.addEventListener('click', closeModal);

    /* Ajout de la flèche pour revenir en arrière */
    const backArrow = document.createElement('i');
    backArrow.classList.add('fas', 'fa-arrow-left', 'back-arrow');
    headerDiv.appendChild(backArrow);

    form.appendChild(headerDiv);

    /* Event listener pour revenir en arrière */
    backArrow.addEventListener('click', function () {
        /* Afficher à nouveau la galerie photo de la fenêtre modale */
        titleAndCloseDiv.style.display = 'flex';
        worksDiv.style.display = 'flex';
        lineDivider.style.display = 'block';
        addPhotoButtonModal.style.display = 'flex';

        /* Cacher le formulaire d'ajout de photo */
        form.style.display = 'none';

        /* Supprimer le formulaire d'ajout de photo du DOM */
        modalWrapper.removeChild(form);
    });
    /* Création des Div pour le rectangle avec le bouton et le texte */
    const rectangleDiv = document.createElement('div');
    rectangleDiv.classList.add('rectangle-div');

    /* Ajout de l'icône fa-image au-dessus du bouton */
    const imageIcon = document.createElement('i');
    imageIcon.classList.add('fas', 'fa-image', 'image-icon');
    rectangleDiv.appendChild(imageIcon);

    /* Création du champ d'entrée de type "file" */
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.classList.add('inputfile');
    fileInput.style.display = 'flex';
    fileInput.style.justifyContent = 'center';
    rectangleDiv.appendChild(fileInput);

    /* Ajout du texte en dessous du bouton */
    const infoText = document.createElement('p');
    infoText.textContent = 'jpg.png : 4mo max';
    rectangleDiv.appendChild(infoText);

    /* Ajout du rectangle à la div du formulaire */
    form.appendChild(rectangleDiv);

    /* Création des Div pour les inputs titre et catégorie */

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('input-div');

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titre';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';

    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Catégorie';
    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.name = 'category';

    inputDiv.appendChild(titleLabel);
    inputDiv.appendChild(titleInput);
    inputDiv.appendChild(categoryLabel);
    inputDiv.appendChild(categoryInput);

    form.appendChild(inputDiv);

    /* Création de la Div pour la ligne de séparation */
    const lineDivider = document.createElement('div');
    lineDivider.classList.add('line-divider');
    form.appendChild(lineDivider);
    lineDivider.style.marginTop = '40px';

    /* Création de la Div pour le bouton Valider */
    const SubmitButtonModal = document.createElement('div');
    SubmitButtonModal.classList.add('Submit-Button-Modal');

    const SubmitButton = document.createElement('button');
    SubmitButton.textContent = 'Valider';
    SubmitButton.classList.add('Submit-Button-Modal');
    SubmitButton.style.backgroundColor = '#1D6154';
    SubmitButton.style.color = 'white';
    SubmitButton.style.padding = '10px';
    SubmitButton.style.border = 'none';
    SubmitButton.style.cursor = 'pointer';
    SubmitButton.style.marginTop = '20px';
    SubmitButton.style.borderRadius = '20px';
    SubmitButton.style.width = '37%';

    SubmitButtonModal.appendChild(SubmitButton);
    form.appendChild(SubmitButtonModal);

    /*Gestionnaire d'événements pour le bouton Valider*/
    SubmitButton.addEventListener('click', async function (event) {
        event.preventDefault();
        /* récupération des valeurs du formulaire */
        const title = titleInput.value;
        const category = categoryInput.value;
        const file = fileInput.files[0];

        /* Vérification des champs */
        if (title && category && file) {
            try {
                /*Envoies des données au serveur*/
                await postData(title, category, file);

                /* Mise à jour des gallery */
                displayWorksInModal();
                displayWorks();

                /*Réinialisation du formulaire*/
                titleInput.value = '';
                categoryInput.value = '';
                fileInput.value = '';
                
            } catch (error) {
                console.error('Erreur lors de l\'ajout du work :', error);
            }
        } else {
            console.error('Veuillez remplir tous les champs.');
        }
    });


    /* Appliquer des styles pour centrer le formulaire */
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.position = 'relative';
    form.style.margin = 'auto';
    form.style.width = '100%';

    return form;
}

/*Fonction pour fermer la fenêtre modale*/
function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

/*Fonction pour envoyer les données au serveur et ajouter un nouveau work*/
async function postData(title, category, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log('Nouveau work ajouté avec succès.');
        } else if (response.status === 401) {
            throw new Error('Action non autorisée');
        } else {
            throw new Error('Erreur lors de l\'ajout du work');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

