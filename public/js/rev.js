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
  function updateHiddenItem() {
            const category = categorySelect.value;
            if (category === 'movie') {
                hiddenItemInput.value = movieSelect.value;
            } else if (category === 'experience') {
                hiddenItemInput.value = experienceSelect.value;
            } else if (category === 'food-drinks') {
                hiddenItemInput.value = foodSelect.value;
            }
        }

        categorySelect.addEventListener('change', (e) => {
            switchCategory(e.target.value);
        });

        movieSelect.addEventListener('change', updateHiddenItem);
        experienceSelect.addEventListener('change', updateHiddenItem);
        foodSelect.addEventListener('change', updateHiddenItem);

        function validateForm() {
            updateHiddenItem();
            if (!hiddenItemInput.value) {
                alert('Please select the item you are reviewing!');
                return false;
            }
            return true;
        }
        switchCategory('movie');

        
        function filterReviews(category, event) {
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');

            document.querySelectorAll('.review-card').forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }