class autoSearch {
    constructor(options = null) {
        if (options !== null) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        if (this.input_id !== '' && this.input_id !== null) {
            this.setTheme();
            this.createSuggestListContainer();
            this.startSearch(this.limit);
        } else {
            return false;
        }
    }

    setSuggestList(result_list_container) {
        this.$suggest_list = result_list_container;
    }

    setTheme() {
        if (this.theme !== undefined) {
            var input_class;
            switch (this.theme) {
                case 'bootstrap' :
                    input_class = 'form-control';
                    break;
                default:
                    input_class = this.theme;
            }
            $('#' + this.input_id).addClass(input_class);
        } else {
        }
    }


    startSearch(limit) {
        this.setSuggestList($('#search-suggest-' + this.input_id + ' ul'));
        var $suggest_list = this.$suggest_list;
        $('#' + this.input_id).on('keyup', {suggest_list: $suggest_list}, function (e) {
            var search_url = 'https://api-adresse.data.gouv.fr/search/';
            $suggest_list = e.data.suggest_list;
            if (e.keyCode == 8) {
                $suggest_list.html('');
                $suggest_list.hide();
            }
            var search = $(this).val();
            if (search.length > 5) {
                $suggest_list.html('');
                search_url = search_url.concat('?q=' + search);
                if (limit !== undefined) {
                    search_url = search_url.concat('&limit=' + limit);
                }
                $.get(search_url, function (data) {
                    var results = data.features;
                    autoSearch.populateResultList(results, $suggest_list);
                    $suggest_list.show();
                });
            }
        });
    }

    deleteSuggestList(e) {
        if (e.keyCode == 8) {
            this.$suggest_list.html('');
        }
    }

    static populateResultList(results, $suggest_list) {
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var label = result.properties.label;
                var number = result.properties.housenumber;
                var street = result.properties.street;
                var postcode = result.properties.postcode;
                var city = result.properties.city;
                var latitude = result.geometry.coordinates[1];
                var longitude = result.geometry.coordinates[0];
                $suggest_list.append('<li data-show-result="' + label + '" data-street="' + street + '" data-postcode="' + postcode + '" data-city="' + city + '" data-number="' + number + '" data-latitude="' + latitude + '" data-longitude="' + longitude + '" class="search-result"><i class="fas fa-map-marker-alt"></i> ' + label + '</li>');
            }
        } else {
            $suggest_list.append('<li><strong>Aucun résultat pour cette recherche </strong></li>')
        }
    }

    createSuggestListContainer() {
        var $input = $('#' + this.input_id);
        $input.wrap('<div class="' + this.theme + '-container"></div>');
        var $suggest_list_container = $('#search-suggest-' + this.input_id);
        if ($suggest_list_container.length < 1) {
            $('<div class="suggest-list" id="search-suggest-' + this.input_id + '"><ul></ul></div>').insertAfter($input);
        }
    }

    getResult(search_value) {
    }
}
