// Path: src/features/about/services/about-service.ts
import { AboutInfo } from "../models/about";

export const aboutService = {
  getAboutInfo(): AboutInfo {
    return {
      mission:
        "Fortalecer o comércio local de Lima Duarte através de tecnologia acessível e conectar consumidores aos melhores produtos e serviços da nossa região.",
      vision:
        "Tornar Lima Duarte uma referência em integração digital do comércio local, preservando a identidade cultural e promovendo o desenvolvimento econômico sustentável.",
      values: [
        {
          title: "Comunidade",
          description:
            "Valorizamos e fortalecemos os laços comunitários, criando um ecossistema que beneficia a todos.",
          icon: "users",
        },
        {
          title: "Regionalidade",
          description:
            "Promovemos o que temos de melhor em nossa região, valorizando produtos e serviços locais.",
          icon: "map-pin",
        },
        {
          title: "Sustentabilidade",
          description:
            "Incentivamos práticas de consumo que fortalecem a economia local e reduzem impactos ambientais.",
          icon: "leaf",
        },
        {
          title: "Inovação",
          description:
            "Integramos tecnologia e tradição para criar soluções que impulsionam nosso comércio.",
          icon: "lightbulb",
        },
      ],
      history: [
        {
          year: "2022",
          title: "Nascimento do Limei",
          description:
            "A ideia surgiu da necessidade de fortalecer o comércio local durante tempos desafiadores para os pequenos empreendedores.",
        },
        {
          year: "2023",
          title: "Primeiros Parceiros",
          description:
            "Estabelecimentos tradicionais de Lima Duarte aderiram à plataforma, criando as primeiras vitrines virtuais da cidade.",
        },
        {
          year: "2024",
          title: "Expansão e Consolidação",
          description:
            "Implementação do sistema de delivery integrado e lançamento da seção de encartes promocionais, conectando ainda mais comerciantes e clientes.",
        },
      ],
      team: [
        {
          name: "Equipe Limei",
          role: "Um time apaixonado pelo desenvolvimento local",
          photo: "",
        },
      ],
      contact: {
        whatsapp: "32988555409",
        email: "contato@limei.com.br",
        instagram: "@limei.marketplace",
      },
    };
  },
};
