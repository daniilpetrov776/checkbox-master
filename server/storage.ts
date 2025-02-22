import { type CheckboxState, type InsertCheckboxState, type CheckboxStates } from "@shared/schema";
import { getDB } from "./database";

// export interface IStorage {
//   getCheckboxStates(): Promise<CheckboxStates>;
//   updateCheckboxState(state: InsertCheckboxState): Promise<CheckboxState>;
// }

export class DBStorage {
  async getCheckboxStates(): Promise<CheckboxStates> {
    const db = await getDB();
    const rows = await db.all('SELECT id, checked FROM checkboxes');
    return rows.reduce((acc, row) => {
      acc[row.id] = row.checked;
      return acc;
    }, {} as CheckboxStates);
  }

  // async updateCheckboxState(state: InsertCheckboxState): Promise<CheckboxState> {
  //   const db = await getDB();
  //   await db.run("INSERT INTO checkboxes (id, checked) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET checked = ?", 
  //     state.id, state.checked, state.checked);
  //   return { id: state.id, checked: state.checked ?? false };
  // }

  async updateCheckboxState(state: InsertCheckboxState): Promise<CheckboxState> {
    const db = await getDB();

    if (state.checked) {
      // Если чекбокс отмечен, добавляем или обновляем запись
      await db.run(
        "INSERT INTO checkboxes (id, checked) VALUES (?, 1) ON CONFLICT(id) DO UPDATE SET checked = 1",
        state.id
      );
    } else {
      // Если чекбокс снят, удаляем его из базы
      await db.run("DELETE FROM checkboxes WHERE id = ?", state.id);
    }

    return { id: state.id, checked: state.checked ?? false };
  }
}

// export class MemStorage implements IStorage {
//   private checkboxStates: CheckboxStates;

//   constructor() {
//     this.checkboxStates = {};
//     // Initialize all checkboxes to unchecked
//     for (let i = 0; i < 1000; i++) {
//       this.checkboxStates[i] = false;
//     }
//   }

//   async getCheckboxStates(): Promise<CheckboxStates> {
//     return this.checkboxStates;
//   }

//   async updateCheckboxState(state: InsertCheckboxState): Promise<CheckboxState> {
//     this.checkboxStates[state.id] = state.checked;
//     return { id: state.id, checked: state.checked };
//   }
// }

export const storage = new DBStorage();
