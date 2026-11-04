import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const location = useLocation();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname === '/feed';
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/">
            <Logo className="" />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.link} ${isActive || isProfileActive ? styles.link_active : ''}`
            }
          >
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">
              {userName ?? 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
