defmodule TimeTracker.TeamContext do
  @moduledoc """
  The TeamContext context.
  """

  import Ecto.Query, warn: false

  alias TimeTracker.Repo

  alias TimeTracker.TeamContext.Team
  alias TimeTracker.TeamContext.TeamUser
  alias TimeTracker.UserContext.User

  @doc """
  Returns the list of teams.

  ## Examples

      iex> list_teams()
      [%Team{}, ...]

  """
  def list_teams(current_user) do
    filter_rights =
      case current_user.role do
        :general_manager ->
          true

        :manager ->
          dynamic([p], p.manager_id == ^current_user.id)

        :employee ->
          raise "Employee cannot list teams"
      end

    query =
      from(t in Team,
        where: ^filter_rights,
        preload: [:users, :manager]
      )

    Repo.all(query)
  end

  @doc """
  Gets a single team.

  Raises `Ecto.NoResultsError` if the Team does not exist.

  ## Examples

      iex> get_team!(123)
      %Team{}

      iex> get_team!(456)
      ** (Ecto.NoResultsError)

  """
  def get_team(id) do
    query =
      from(Team,
        where: [id: ^id],
        preload: [:users, :manager]
      )

    Repo.one(query)
  end

  @doc """
  Creates a team.

  ## Examples

      iex> create_team(%{field: value})
      {:ok, %Team{}}

      iex> create_team(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_team(attrs \\ %{}) do
    manager = Repo.get(User, attrs["manager_id"])

    %Team{}
    |> Team.changeset(%{name: attrs["name"]})
    |> Ecto.Changeset.put_assoc(:manager, manager)
    |> Repo.insert()
  end

  def create_team_user(attrs \\ %{}) do
    %TeamUser{user_id: attrs["user_id"], team_id: attrs["team_id"]}
    |> Repo.insert()
  end

  @doc """
  Updates a team.

  ## Examples

      iex> update_team(team, %{field: new_value})
      {:ok, %Team{}}

      iex> update_team(team, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_team(%Team{} = team, attrs) do
    user_ids = attrs["user_ids"]

    users = User |> where([u], u.id in ^user_ids) |> Repo.all()

    team
    |> Ecto.Changeset.change()
    |> Ecto.Changeset.put_assoc(:users, users)
    |> Repo.update()
  end

  @doc """
  Deletes a team.

  ## Examples

      iex> delete_team(team)
      {:ok, %Team{}}

      iex> delete_team(team)
      {:error, %Ecto.Changeset{}}

  """
  def delete_team(%Team{} = team) do
    Repo.delete(team)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking team changes.

  ## Examples

      iex> change_team(team)
      %Ecto.Changeset{data: %Team{}}

  """
  def change_team(%Team{} = team, attrs \\ %{}) do
    Team.changeset(team, attrs)
  end
end
