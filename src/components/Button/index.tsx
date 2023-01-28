import React from "react";
import styles from "./index.module.css";

export const Button: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <button type="button" className={styles.button}>
    {children}
  </button>
);
