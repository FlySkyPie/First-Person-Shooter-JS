let actualAmmo = 0, score = 0, level = 0;

export const updateAmmo = (newAmmo) => {
    const text = document.getElementById("ammo");
    text.innerHTML = "Munición: " + newAmmo;
}

export const updateScore = (newScore) => {
    const text = document.getElementById("score");
    text.innerHTML = "Puntuacion: " + newScore;
}

export const updateLevel = (newLevel) => {
    const level = document.getElementById("level");
    level.innerHTML = "Nivel: " + newLevel;
}

export const createHUDElement = () => {
    const scoreElement = document.createElement('div');

    scoreElement.id = "score";
    scoreElement.style.position = 'absolute';
    scoreElement.style.width = 1;
    scoreElement.style.height = 1;
    scoreElement.innerHTML = "Puntuación: 0";
    scoreElement.style.top = 50 + 'px';
    scoreElement.style.left = 50 + 'px';
    scoreElement.style.fontSize = 50 + 'px';
    scoreElement.style.color = "white";
    document.body.appendChild(scoreElement);

    const ammoElement = document.createElement('div');
    ammoElement.id = "ammo";
    ammoElement.style.position = 'absolute';
    ammoElement.style.width = 1;
    ammoElement.style.height = 1;
    ammoElement.innerHTML = "Munición: 0";
    ammoElement.style.top = 100 + 'px';
    ammoElement.style.left = 50 + 'px';
    ammoElement.style.fontSize = 50 + 'px';
    ammoElement.style.color = "white";
    document.body.appendChild(ammoElement);

    const levelElement = document.createElement('div');
    levelElement.id = "level";
    levelElement.style.position = 'absolute';
    levelElement.style.width = 1;
    levelElement.style.height = 1;
    levelElement.innerHTML = "Nivel: 0";
    levelElement.style.top = 150 + 'px';
    levelElement.style.left = 50 + 'px';
    levelElement.style.fontSize = 50 + 'px';
    levelElement.style.color = "white";
    document.body.appendChild(levelElement);

    return { scoreElement, ammoElement, levelElement, };
}