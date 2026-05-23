 const categorySelect = document.getElementById('category');
        const movieGroup = document.getElementById('movie-select-group');
        const experienceGroup = document.getElementById('experience-select-group');
        const foodGroup = document.getElementById('food-select-group');

        const movieSelect = document.getElementById('movie-item');
        const experienceSelect = document.getElementById('experience-item');
        const foodSelect = document.getElementById('food-item');
        const hiddenItemInput = document.getElementById('item');

         function switchCategory(category) {
            movieGroup.style.display = category === 'movie' ? 'block' : 'none';
            experienceGroup.style.display = category === 'experience' ? 'block' : 'none';
            foodGroup.style.display = category === 'food-drinks' ? 'block' : 'none';
            
            movieSelect.required = category === 'movie';
            experienceSelect.required = category === 'experience';
            foodSelect.required = category === 'food-drinks';

            updateHiddenItem();
        }
