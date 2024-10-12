$(function () {
    var api_data = null;
    var displayed_data = null;

    getApiData();

    $('body').on('input', '#search', function () {
        let value = $(this).val();
        let filtered = filterData(value);
        showData(filtered);
    });

    $('body').on('click', '.sort-data-btn', function () {
        let order = $(this).data('order');
        showData(sortData(order));
    });
});

const getApiData = async () => {
    const api_url = `http://jsonplaceholder.typicode.com/users`;
    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        api_data = await response.json();
        showData(api_data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    return api_data;
}

const filterData = (search) => {
    return api_data.filter(item => {
        return Object.values(item).some(value => {
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(subValue => 
                    subValue.toString().toLowerCase().includes(search.toLowerCase())
                );
            }
            return value.toString().toLowerCase().includes(search.toLowerCase());
        });
    });
};

const sortData = (order) => {
    return displayed_data.sort((a, b) => {
        if (a.name < b.name) {
            return order === 'ascending' ? -1 : 1;
        }
        if (a.name > b.name) {
            return order === 'ascending' ? 1 : -1;
        }
        return 0;
    });
};

const showData = (data) => {
    displayed_data = data;
    let html = '';
    data.forEach(element => {
        html+= `
            <div class="col-md-3 col-sm-6 mb-4">
                <div class="card h-100">
                    <img class="card-img-top" src="https://i.pravatar.cc/150?img=${element.id}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <p class="text-muted">
                            @${element.username}
                        </p>
                        <p class="text-primary">
                            "${element.company?.catchPhrase}"
                        </p>
                        <p>
                            <i class="fa fa-envelope mr-2" aria-hidden="true"></i>
                            <span>${element.email}</span>
                        </p>
                        <p>
                            <i class="fa fa-map-marker mr-2" aria-hidden="true"></i>
                            <span>${ stringifyProperties(element.address) }</span>
                        </p>
                        <p>
                            <i class="fa fa-phone mr-2" aria-hidden="true"></i>
                            <span>${element.phone}</span>
                        </p>
                        <p>
                            <i class="fa fa-globe mr-2" aria-hidden="true"></i>
                            <span>${element.website}</span>
                        </p>
                        <p>
                            <i class="fa fa-briefcase mr-2" aria-hidden="true"></i>
                            <span>${element.company?.name}</span>
                        </p>
                        <p>
                            <i class="fa fa-industry mr-2" aria-hidden="true"></i>
                            <span>${element.company?.bs}</span>
                        </p>
                    </div>
                </div>
            </div>
        `;
    });
    $('#user-profiles').html(html);
};

const stringifyProperties = (object) => {
    const values = [];

    const extractValues = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                extractValues(obj[key]);
            } else {
                values.push(obj[key]);
            }
        }
    };

    extractValues(object);
    return values.join(', ');
};