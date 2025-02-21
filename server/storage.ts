import { type CheckboxState, type InsertCheckboxState, type CheckboxStates } from "@shared/schema";

export interface IStorage {
  getCheckboxStates(): Promise<CheckboxStates>;
  updateCheckboxState(state: InsertCheckboxState): Promise<CheckboxState>;
}

export class MemStorage implements IStorage {
  private checkboxStates: CheckboxStates;

  constructor() {
    this.checkboxStates = {};
    // Initialize all checkboxes to unchecked
    for (let i = 0; i < 1000; i++) {
      this.checkboxStates[i] = false;
    }
  }

  async getCheckboxStates(): Promise<CheckboxStates> {
    return this.checkboxStates;
  }

  async updateCheckboxState(state: InsertCheckboxState): Promise<CheckboxState> {
    this.checkboxStates[state.id] = state.checked;
    return { id: state.id, checked: state.checked };
  }
}

export const storage = new MemStorage();
