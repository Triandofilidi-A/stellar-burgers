import { IngredientDetails } from '@components';

import styles from './ingredient-details-page.module.css';

export const IngredientDetailsPage = (): React.JSX.Element => (
  <main className={styles.container}>
    <h1 className={`${styles.title} text text_type_main-large`}>Детали ингредиента</h1>
    <IngredientDetails />
  </main>
);
