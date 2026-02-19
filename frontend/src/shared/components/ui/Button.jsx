import styles from './Button.module.css';

export const Button = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        className
    ].filter(Boolean).join(' ');

    return (
        <button className={classNames} {...props}>
            {children}
        </button>
    );
};
