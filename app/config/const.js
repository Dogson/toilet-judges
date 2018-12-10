// LES DIFFERENTS TYPES SONT PAR ORDRE DE PRIORITE.
// Ex : pour un établissement "Boite de nuit" et "Bar" on retiendra uniquement Boite de nuit
export const PLACE_TYPES = [
    {
        id: 'gym',
        name: 'Salle de sport',
        icon: {
            name: 'fitness-center'
        }
    },
    {
        id: 'doctor',
        name: 'Docteur',
        icon: {
            name: 'doctor',
            type: 'material-community'

        }
    },
    {
        id: 'pharmacy',
        name: 'Pharmacie',
        icon: {
            name: 'medical-bag',
            type: 'material-community'
        }
    },
    {
        id: 'health',
        name: 'Santé',
        icon: {
            name: 'medical-bag',
            type: 'material-community'
        }
    },
    {
        id: 'bank',
        name: 'Banque',
        icon: {
            name: 'bank',
            type: 'material-community'
        }
    },
    {
        id: 'airport',
        name: 'Aéroport',
        icon: {
            name: 'local-airport'
        }
    },
    {
        id: 'aquarium',
        name: 'Aquarium',
        icon: {
            name: 'fish',
            type: 'material-community'
        }
    },
    {
        id: 'bakery',
        name: 'Boulangerie',
        icon: {
            name: 'food-croissant',
            type: 'material-community'
        }
    },
    {
        id: 'library',
        name: 'Bibliothèque',
        icon: {
            name: 'local-library'
        }
    },
    {
        id: 'book_store',
        name: 'Librairie',
        icon: {
            name: 'local-library'
        }
    },
    {
        id: 'museum',
        name: 'Musée',
        icon: {
            name: 'local-library'
        }
    },
    {
        id: 'bowling_alley',
        name: 'Bowling',
        icon: {
            name: 'bowling',
            type: 'material-community'
        },
    },
    {
        id: 'movie_theater',
        name: 'Cinéma',
        icon: {
            name: 'local-movies'
        }
    },
    {
        id: 'casino',
        name: 'Casino',
        icon: {
            name: 'casino'
        },
    },
    {
        id: 'lodging',
        name: 'Hotel',
        icon: {
            name: 'hotel'
        },
    },
    {
        id: 'restaurant',
        name: "Restaurant",
        icon: {
            name: 'restaurant'
        }
    },
    {
        id: 'night_club',
        name: 'Boîte de nuit',
        icon: {
            name: 'local-bar',
        }
    },
    {
        id: 'bar',
        name: 'Bar',
        icon: {
            name: 'ios-beer',
            type: 'ionicon'
        }
    },
    {
        id: 'cafe',
        name: 'Café',
        icon: {
            name: 'local-cafe'
        },
    },
];

export const RATINGS = [
    '',
    'Horrible',
    'Médiocre',
    'Moyen',
    'Bien',
    'Excellent'
];