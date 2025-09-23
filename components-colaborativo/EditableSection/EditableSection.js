import { useState, useEffect } from 'react';
import styles from './EditableSection.module.css';
import { IoAddCircle, IoTrash } from 'react-icons/io5';

export default function EditableSection({ title, data, fields, fieldName, onSave }) {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({});

    useEffect(() => {
        setItems(data || []);
        // Inicializa o newItem com chaves vazias baseadas nos fields
        const emptyItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
        setNewItem(emptyItem);
    }, [data, fields]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        // Validação simples para não adicionar item vazio
        if (Object.values(newItem).every(val => val === '')) return;

        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        onSave(fieldName, updatedItems); // Salva a lista inteira
        
        // Reseta o formulário
        const emptyItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
        setNewItem(emptyItem);
    };

    const handleDeleteItem = (indexToDelete) => {
        const updatedItems = items.filter((_, index) => index !== indexToDelete);
        setItems(updatedItems);
        onSave(fieldName, updatedItems); // Salva a lista inteira
    };

    return (
        <div className={styles.section}>
            <h2>{title}</h2>
            <div className={styles.itemList}>
                {items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                        {fields.map(field => (
                            <div key={field.name} className={styles.itemCell}>
                                <span className={styles.itemLabel}>{field.label}</span>
                                <span className={styles.itemValue}>{item[field.name]}</span>
                            </div>
                        ))}
                        <button onClick={() => handleDeleteItem(index)} className={styles.deleteButton}><IoTrash /></button>
                    </div>
                ))}
            </div>
            <form onSubmit={handleAddItem} className={styles.formGrid}>
                {fields.map(field => (
                    <input
                        key={field.name}
                        type="text"
                        name={field.name}
                        placeholder={field.placeholder}
                        value={newItem[field.name]}
                        onChange={handleInputChange}
                        className={styles.input}
                    />
                ))}
                <button type="submit" className={styles.addButton}><IoAddCircle /></button>
            </form>
        </div>
    );
}