// src/lib/db/client.ts
// This is a placeholder/mock for the Drizzle ORM database client.
// In a real production environment, this file would initialize and export
// a connection to a PostgreSQL database. To adhere to the "local-only"
// requirement, this mock logs to the console instead of a database.

const mockDbClient = {
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: (fields: any): Promise<any[]> => {
        console.log(`[DB MOCK] INSERT into ${table.name} with values:`, data);
        const id = `mock-uuid-${Date.now()}`;
        return Promise.resolve([{ id, ...fields }]);
      },
    }),
  }),
  update: (table: any) => ({
    set: (data: any) => ({
      where: (condition: any) => {
        console.log(`[DB MOCK] UPDATE ${table.name} SET`, data, `WHERE`, condition);
        return Promise.resolve();
      },
    }),
  }),
};

export const db = mockDbClient as any;

// Mock for the 'eq' operator from drizzle-orm
export const eq = (field: any, value: any) => `${field.name} = '${value}'`;