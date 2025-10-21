//git commit -m "Mensaje que describa los cambios"
//git push
import express, {
    type NextFunction,
    type Request,
    type Response,
  } from "express";
  import cors from "cors";
  import axios from "axios";
  
  // Tipos
  type LD = {
    id:number;
    filmName: string;
    rotationType: "CAV"|"CLV";
    region: string;
    lenghtMinutes: number;
    videoFormat: "NTSC"|"PAL";
  };

  let lds:LD[] = [
    {
    id:1,
    filmName: "name1",
    rotationType: "CLV",
    region: "ESP",
    lenghtMinutes: 123,
    videoFormat: "NTSC"
  },
  {
    id:2,
    filmName: "name2",
    rotationType: "CAV",
    region: "USA",
    lenghtMinutes: 99,
    videoFormat: "PAL"
  }];

  const app = express();
  const port = 3000;
  
  app.use(cors());
  app.use(express.json());
  
  // --- Middleware de error genérico ---
  const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error("Error detectado:", err.message);
    res
      .status(500)
      .json({ error: "Error interno del servidor", detail: err.message });
  };

  // --- Rutas ---
  app.get("/", (req: Request, res: Response) => {
    res.send("✅ Okey makei, te has conectado correctamente.");
  });
  
  app.get("/ld", (req: Request, res: Response) => {
    res.json(lds);
  });

  app.get("/ld/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const disco = lds.find((p) => p.id === Number(id));
  
    return disco
      ? res.json(disco)
      : res.status(404).json({ error: "Disco no encontrado" });
  });


  app.post("/ld", (req: Request, res: Response) => {
    try {
      const newLD: LD = {
        id: Date.now(),
        ...req.body,
      };
  
      lds.push(newLD);
      res.status(201).json(newLD);
    } catch (err: any) {
      res
        .status(500)
        .json({ error: "Error al crear el disco", detail: err.message });
    }
  });

  app.delete("/ld/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const exists = lds.some((p:LD) => p.id === Number(id));
  
      if (!exists)
        return res.status(404).json({ error: "Disco no encontrado" });
  
      lds = lds.filter((p:LD) => p.id !== Number(id));
  
      res.json({ message: "Disco eliminado correctamente" });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: "Error al eliminar el disco", detail: err.message });
    }
  });


  // Middleware final (ruta no encontrada)
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Ruta no encontrada" });
  });
  
  // Middleware de error
  app.use(errorHandler);
  
  // --- Inicio del servidor ---
  app.listen(port, () => {
    console.log(`🚀 Server started at http://localhost:${port}`);
  });

  //1. obtener todos los lds

  const getLd = async (id?: number) => {
    try {
      const url = id
        ? `http://localhost:3000/ld/${id}`
        : "http://localhost:3000/ld";
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error: " + err.message);
      } else {
        console.log("Error: " + err);
      }
    }
  };
// 2. muestra la lista inicial por consola
  console.log(await getLd())
// 3. crear nuevo disco
  const postLd= async (filmName: string,rotationType:string,region:string,lenghtMinutes:number,videoFormat:string) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/ld`, {"filmName":filmName,"rotationType":rotationType,"region": region,"lenghtMinutes":lenghtMinutes,"videoFormat":videoFormat}
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error: " + err.message);
      } else {
        console.log("Error: " + err);
      }
    }
  };

  console.log(await postLd("name3","CAV","JAP",200,"PAL"))
  // 4. volver a imprimir todos los lds
  // 5. comprueba que aparece el nuevo equipo
  console.log(await getLd())

  // 6. eliminar ld
  const deleteLd = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/ld/${id}`
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error: " + err.message);
      } else {
        console.log("Error: " + err);
      }
    }
  };

  console.log(await deleteLd(2))
// 7. mostrar lista final
  console.log(await getLd())