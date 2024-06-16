export const Paginator = (page_number, num_page, refreshComponent) => {
    const paginatorContainer = document.querySelector('#paginator-container');
    paginatorContainer.innerHTML = "";
    for (let number = 1; number < num_page + 1; number++) {
        const paginatorItem = document.createElement('li');
        paginatorItem.classList.add('page-link', 'page-item');
        paginatorItem.innerText = number;
        paginatorItem.addEventListener('click', () => {
            refreshComponent(number);
        });

        paginatorContainer.append(paginatorItem);
    }
}