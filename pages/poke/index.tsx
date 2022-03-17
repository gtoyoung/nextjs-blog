import React, { useEffect, useRef, useState } from "react";
import { Layout } from "components/layout";
import { GetStaticProps } from "next";
import { PokeApi } from "services/poke";
import { PoketInfo } from "services/poke.types";
import FbDatabase from "services/firebase/database";
import PokemonCard from "components/poke/pokemonCard";
import { Pokemons } from "../../components/poke/indexStyle";
import { PokeSearchBox } from "components/poke/pokeSearchbox";
import Drawer from "react-drag-drawer";
import "./style.css";

const db = new FbDatabase(false);
const pokeApi = new PokeApi();

export const getStaticProps: GetStaticProps = async () => {
  const nameList = await db.getPokeNameList();
  const pokeList = await pokeApi.getPoketList(0, 21);
  const result = JSON.stringify(pokeList);
  return {
    props: {
      result,
      nameList,
    },
  };
};

const PokePage = ({ result, nameList }: { result: any; nameList: any[] }) => {
  const perPage = 21;
  let currentPage = 21;
  const jsonConvert = JSON.parse(result);
  const pokeList: PoketInfo[] = jsonConvert;
  const [loaded, setLoaded] = useState(false);
  const [pokemons, setPokemons] = useState([] as PoketInfo[]);
  const [drawer, setDrawer] = useState(false);
  const [selectPoke, setSelectPoke] = useState(null as PoketInfo | null);
  //무한로딩을 위한 작업
  const cardListRef = useRef(null);
  const onIntersect = ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      pokeApi
        .getPoketList(currentPage, perPage)
        .then((res) => {
          if (res != null) {
            setPokemons((prev) => [...prev, ...res]);
          } else {
            setLoaded(true);
          }
        })
        .catch(() => {
          setLoaded(true);
        })
        .finally(() => {
          currentPage += perPage;
          observer.observe(entry.target);
        });
    }
  };
  // 초기데이터 셋팅
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });
    observer.observe(cardListRef.current);
    setPokemons(pokeList);
    return () => observer.disconnect();
  }, []);

  // 한글이름으로 변환
  const convertKorName = (name: string) => {
    var result = nameList.find((element) => {
      if (element.en.toUpperCase() === name?.toUpperCase()) return true;
    });

    return result?.ko || name;
  };

  const getSelectPokeInfo = (name: string) => {
    return pokeApi.getPoketInfo(name).then((res) => {
      return res;
    });
  };

  return (
    <Layout isMax={true}>
      <div>
        <div>
          <h1>Poke Page</h1>
          <PokeSearchBox
            nameList={nameList}
            changePokemon={async (pokemon) => {
              if (pokemon) {
                await getSelectPokeInfo(pokemon?.toLowerCase()).then((res) => {
                  setSelectPoke(res);
                  setDrawer(true);
                });
              }
            }}
          />
        </div>
        <div>
          <Pokemons>
            {pokemons.map((item) => {
              return (
                <PokemonCard
                  koName={
                    convertKorName(item.name)
                      ? convertKorName(item.name)
                      : item.name
                  }
                  poke={item}
                  onClick={(pokeInfo) => {
                    setDrawer(true);
                    setSelectPoke(pokeInfo);
                  }}
                />
              );
            })}
          </Pokemons>
          {
            <Drawer
              open={drawer}
              onOpen={() => {
                document
                  .getElementsByClassName("drawer-modal")[0]
                  .setAttribute(
                    "style",
                    `background-color:${selectPoke?.color}`
                  );
              }}
              onRequestClose={() => {
                // document
                //   .getElementsByClassName("drawer-modal")[0]
                //   .setAttribute("style", `background-color:transparent`);
                setDrawer(false);
              }}
              direction="y"
              allowClose={true}
              modalElementClass="drawer-modal"
              containerElementClass="my-shade"
            >
              <div>
                {convertKorName(selectPoke?.name) ? (
                  <h3>
                    {convertKorName(selectPoke?.name) +
                      "(" +
                      selectPoke?.name +
                      ")"}
                  </h3>
                ) : (
                  <h2>{selectPoke?.name}</h2>
                )}
                <img
                  src={selectPoke?.img.home}
                  alt="pokemon"
                  style={{
                    border: "0px",
                    display: "inline",
                    width: "35%",
                  }}
                />
                <br />
                <h4>신장 : {selectPoke?.height}0 CM</h4>
                <h4>체중 : {selectPoke?.weight}00 G</h4>
                <h4>
                  타입 :
                  {selectPoke?.types.map((type) => {
                    return type.type.name + " ";
                  })}
                </h4>
              </div>
            </Drawer>
          }

          {!loaded && (
            <div ref={cardListRef}>
              <h3>Loading...</h3>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PokePage;
