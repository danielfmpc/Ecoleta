import Knex from "knex";

export async function seed(kenx: Knex) {
  await kenx('items').insert(
    [
      { title: 'Lâmpadas', img: 'lampadas.svg' },
      { title: 'Pilhas e Baterias', img: 'baterias.svg' },
      { title: 'Papéis e Papelão', img: 'papeis-papelao.svg' },
      { title: 'Resíduos Eletrônicos', img: 'eletronicos.svg' },
      { title: 'Resíduos Orgnânicos', img: 'organicos.svg' },
      { title: 'Óleo de Cozinha', img: 'oleo.svg' },
    ]
  );
}